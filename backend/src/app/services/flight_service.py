import logging
import json
from typing import Any, List
from datetime import datetime, date

import httpx

from ..core.config import settings
from ..core.exceptions.http_exceptions import CustomException

logger = logging.getLogger(__name__)


class FlightServiceError(CustomException):
    """Custom exception for flight service errors."""

    def __init__(self, message: str, status_code: int = 503) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(status_code=status_code, detail=message)


class LocationProcessor:
    """
    Loads and processes airport/city/country data for generating API query keys.
    """
    def __init__(self, data_file_path="/code/app/airport_data.json"):
        self.data_file_path = data_file_path
        self._lookup_data = self._load_data()

        self.airport_map = self._lookup_data.get("AIRPORT_MAP", {})
        self.city_api_key_map = self._lookup_data.get("CITY_API_KEY_MAP", {})
        self.country_map = self._lookup_data.get("COUNTRY_MAP", {})
        self.ambiguous_city_map = self._lookup_data.get("AMBIGUOUS_CITY_MAP", {})

    def _load_data(self) -> dict[str, Any]:
        try:
            with open(self.data_file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            logger.warning(f"Location data failed to load from {self.data_file_path}")
            return {}

    def _get_entity_key(self, input_value: str) -> str | None:
        if not input_value:
            return None
        
        clean_input = input_value.strip()
        upper_input = clean_input.upper()

        # Passthrough if already formatted (e.g. City:berlin_de)
        if ":" in clean_input:
            return clean_input

        # Standard lookups
        if len(upper_input) == 3 and upper_input in self.airport_map:
            return f"Airport:{upper_input}"
        if upper_input in self.country_map:
            return f"Country:{self.country_map[upper_input]}"
        if upper_input in self.ambiguous_city_map:
            return f"City:{self.ambiguous_city_map[upper_input]}"
        
        target_city_lower = clean_input.lower()
        for key, name in self.city_api_key_map.items():
            if name.lower() == target_city_lower:
                return f"City:{key}"

        return None

    def process_locations(self, location_string: str) -> List[str]:
        if not location_string:
            return []
        inputs = [part.strip() for part in location_string.split(',') if part.strip()]
        results = []
        for val in inputs:
            key = self._get_entity_key(val)
            if key:
                results.append(key)
        return results


class FlightService:
    def __init__(self) -> None:
        self.base_url = f"https://{settings.RAPIDAPI_HOST}"
        self.headers = {
            "x-rapidapi-key": settings.RAPIDAPI_KEY, 
            "x-rapidapi-host": settings.RAPIDAPI_HOST
        }
        self.timeout = 30.0
        self.location_processor = LocationProcessor() 

    def _format_date_for_api(self, date_str: str | None) -> str | None:
        """Ensures date is in DD/MM/YYYY format required by Kiwi.com RapidAPI."""
        if not date_str:
            return None
        
        # List of formats to try, in order of likelihood
        formats_to_try = [
            "%Y-%m-%d",             # 2026-01-15
            "%Y-%m-%dT%H:%M:%S",    # 2026-01-15T00:00:00
            "%Y-%m-%dT%H:%M:%S.%f", # 2026-01-15T00:00:00.000
            "%d/%m/%Y",             # Already in correct format
        ]
        
        for fmt in formats_to_try:
            try:
                dt = datetime.strptime(date_str, fmt)
                return dt.strftime("%d/%m/%Y")
            except ValueError:
                continue
        
        # Last resort: try to extract just the date part if it's ISO-ish
        if "T" in date_str:
            date_part = date_str.split("T")[0]
            try:
                dt = datetime.strptime(date_part, "%Y-%m-%d")
                return dt.strftime("%d/%m/%Y")
            except ValueError:
                pass
        
        # If nothing works, log warning and return as-is
        logger.warning(f"Could not parse date format: {date_str}")
        return date_str

    def _build_query_params(self, request_data: dict[str, Any], is_round_trip: bool = False) -> dict[str, Any]:
        params = {}
        
        # 1. Locations
        src = request_data.get("source")
        dst = request_data.get("destination")
        
        if src:
            locs = self.location_processor.process_locations(src)
            if locs: params["source"] = ",".join(locs)
        
        if dst:
            locs = self.location_processor.process_locations(dst)
            if locs: params["destination"] = ",".join(locs)

        # 2. Base Parameters
        # Map internal keys to API keys
        base_mapping = {
            "currency": "currency",
            "locale": "locale",
            "adults": "adults",
            "children": "children",
            "infants": "infants",
            "cabin_class": "cabinClass",
            "limit": "limit",
            "sort_by": "sortBy",
        }

        for internal, external in base_mapping.items():
            if internal in request_data and request_data[internal] is not None:
                params[external] = request_data[internal]

        # 3. Date Handling
        # Kiwi.com RapidAPI uses:
        # - Round-trip: departureDateStart/departureDateEnd + returnDateStart/returnDateEnd
        # - One-way: departureDateStart/departureDateEnd
        
        today_formatted = date.today().strftime("%d/%m/%Y")

        if is_round_trip:
            # ROUND TRIP PARAMS - uses departureDateStart/End for outbound, returnDateStart/End for inbound
            
            # Outbound (departure) dates
            dep_start = self._format_date_for_api(request_data.get("outbound_department_date_start")) or today_formatted
            params["departureDateStart"] = dep_start
            
            dep_end = self._format_date_for_api(request_data.get("outbound_department_date_end")) or dep_start
            params["departureDateEnd"] = dep_end

            # Inbound (return) dates
            ret_start = self._format_date_for_api(request_data.get("inbound_departure_date_start"))
            if ret_start:
                params["returnDateStart"] = ret_start
            
            ret_end = self._format_date_for_api(request_data.get("inbound_departure_date_end"))
            if ret_end:
                params["returnDateEnd"] = ret_end
            elif ret_start:
                params["returnDateEnd"] = ret_start
                
        else:
            # ONE WAY PARAMS
            d_start = self._format_date_for_api(request_data.get("departure_date_start")) or today_formatted
            params["departureDateStart"] = d_start
            
            d_end = self._format_date_for_api(request_data.get("departure_date_end")) or d_start
            params["departureDateEnd"] = d_end

        # 4. Optional Filters (Bags, Stops, Price)
        if request_data.get("price_end"):
            params["priceEnd"] = request_data["price_end"]
        
        if request_data.get("max_stops_count") is not None:
             params["maxStopsCount"] = request_data["max_stops_count"]

        return params

    async def search_round_trip(self, request_data: dict[str, Any]) -> dict[str, Any]:
        try:
            params = self._build_query_params(request_data, is_round_trip=True)
            logger.info(f"Searching Round Trip: {params}")
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/round-trip", headers=self.headers, params=params)
                
                if response.status_code != 200:
                    logger.error(f"API Error {response.status_code}: {response.text}")
                    return {"data": []}
                
                return response.json()

        except Exception as e:
            logger.exception(f"Search failed: {e}")
            raise FlightServiceError(str(e))

    async def search_one_way(self, request_data: dict[str, Any]) -> dict[str, Any]:
        try:
            params = self._build_query_params(request_data, is_round_trip=False)
            logger.info(f"Searching One Way: {params}")

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/one-way", headers=self.headers, params=params)
                
                if response.status_code != 200:
                    logger.error(f"API Error {response.status_code}: {response.text}")
                    return {"data": []}

                return response.json()

        except Exception as e:
            logger.exception(f"Search failed: {e}")
            raise FlightServiceError(str(e))


flight_service = FlightService()