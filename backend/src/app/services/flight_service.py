import logging
from typing import Any

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


class FlightService:
    """Service for interacting with RapidAPI Kiwi.com Flight Search API."""

    def __init__(self) -> None:
        self.base_url = f"https://{settings.RAPIDAPI_HOST}"
        self.headers = {"x-rapidapi-key": settings.RAPIDAPI_KEY, "x-rapidapi-host": settings.RAPIDAPI_HOST}
        self.timeout = 30.0

    def _build_query_params(self, request_data: dict[str, Any]) -> dict[str, Any]:
        """Build query parameters from request data, converting snake_case to camelCase.

        Parameters
        ----------
        request_data: Dict[str, Any]
            Request data dictionary

        Returns
        -------
        Dict[str, Any]
            Query parameters with camelCase keys
        """
        field_mapping = {
            "source": "source",
            "destination": "destination",
            "currency": "currency",
            "locale": "locale",
            "adults": "adults",
            "children": "children",
            "infants": "infants",
            "handbags": "handbags",
            "holdbags": "holdbags",
            "cabin_class": "cabinClass",
            "sort_by": "sortBy",
            "sort_order": "sortOrder",
            "apply_mixed_classes": "applyMixedClasses",
            "allow_return_from_different_city": "allowReturnFromDifferentCity",
            "allow_change_inbound_destination": "allowChangeInboundDestination",
            "allow_change_inbound_source": "allowChangeInboundSource",
            "allow_different_station_connection": "allowDifferentStationConnection",
            "enable_self_transfer": "enableSelfTransfer",
            "allow_overnight_stopover": "allowOvernightStopover",
            "enable_true_hidden_city": "enableTrueHiddenCity",
            "enable_throw_away_ticketing": "enableThrowAwayTicketing",
            "price_start": "priceStart",
            "price_end": "priceEnd",
            "max_stops_count": "maxStopsCount",
            "outbound": "outbound",
            "transport_types": "transportTypes",
            "content_providers": "contentProviders",
            "limit": "limit",
            "inbound_departure_date_start": "inboundDepartureDateStart",
            "inbound_departure_date_end": "inboundDepartureDateEnd",
            "outbound_department_date_start": "outboundDepartmentDateStart",
            "outbound_department_date_end": "outboundDepartmentDateEnd",
            "departure_date_start": "departureDateStart",
            "departure_date_end": "departureDateEnd",
        }

        params = {}
        for field_name, api_param in field_mapping.items():
            value = request_data.get(field_name)
            if value is not None:
                if isinstance(value, bool):
                    params[api_param] = "true" if value else "false"
                else:
                    params[api_param] = value

        return params

    async def search_round_trip(self, request_data: dict[str, Any]) -> dict[str, Any]:
        """Search for round-trip flights via RapidAPI.

        Parameters
        ----------
        request_data: Dict[str, Any]
            Flight search parameters

        Returns
        -------
        Dict[str, Any]
            Flight search results

        Raises
        ------
        FlightServiceError
            If the API request fails
        """
        try:
            params = self._build_query_params(request_data)

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                logger.info(
                    f"Requesting round-trip flights: {params.get('source')} -> {params.get('destination')}"
                )
                response = await client.get(f"{self.base_url}/round-trip", headers=self.headers, params=params)

                if response.status_code != 200:
                    logger.error(f"RapidAPI error: {response.status_code} - {response.text}")
                    raise FlightServiceError(
                        message=f"Failed to retrieve flights: HTTP {response.status_code}",
                        status_code=response.status_code,
                    )

                data = response.json()
                logger.info(f"Successfully fetched {len(data.get('data', []))} round-trip flights")
                return data

        except httpx.TimeoutException as e:
            logger.error(f"RapidAPI request timeout: {e}")
            raise FlightServiceError(message="Flight search request timed out", status_code=408)
        except httpx.RequestError as e:
            logger.error(f"RapidAPI connection error: {e}")
            raise FlightServiceError(message="Unable to connect to flight search service", status_code=503)
        except FlightServiceError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in flight search: {e}")
            raise FlightServiceError(message="An unexpected error occurred during flight search", status_code=500)

    async def search_one_way(self, request_data: dict[str, Any]) -> dict[str, Any]:
        """Search for one-way flights via RapidAPI.

        Parameters
        ----------
        request_data: Dict[str, Any]
            Flight search parameters

        Returns
        -------
        Dict[str, Any]
            Flight search results

        Raises
        ------
        FlightServiceError
            If the API request fails
        """
        try:
            params = self._build_query_params(request_data)

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                logger.info(f"Requesting one-way flights: {params.get('source')} -> {params.get('destination')}")
                response = await client.get(f"{self.base_url}/one-way", headers=self.headers, params=params)

                if response.status_code != 200:
                    logger.error(f"RapidAPI error: {response.status_code} - {response.text}")
                    raise FlightServiceError(
                        message=f"Failed to retrieve flights: HTTP {response.status_code}",
                        status_code=response.status_code,
                    )

                data = response.json()
                logger.info(f"Successfully fetched {len(data.get('data', []))} one-way flights")
                return data

        except httpx.TimeoutException as e:
            logger.error(f"RapidAPI request timeout: {e}")
            raise FlightServiceError(message="Flight search request timed out", status_code=408)
        except httpx.RequestError as e:
            logger.error(f"RapidAPI connection error: {e}")
            raise FlightServiceError(message="Unable to connect to flight search service", status_code=503)
        except FlightServiceError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in flight search: {e}")
            raise FlightServiceError(message="An unexpected error occurred during flight search", status_code=500)


flight_service = FlightService()