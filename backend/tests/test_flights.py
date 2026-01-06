"""Unit tests for flight API endpoints."""

from unittest.mock import AsyncMock, Mock, patch

import pytest

from src.app.api.v1.flights import search_one_way_flights, search_round_trip_flights
from src.app.services.flight_service import FlightServiceError


class TestSearchRoundTripFlights:
    """Test round-trip flight search endpoint."""

    @pytest.mark.asyncio
    async def test_search_round_trip_success(self, mock_redis):
        """Test successful round-trip flight search."""
        mock_request = Mock()
        mock_request.method = "GET"

        mock_response = {
            "data": [
                {
                    "id": "flight123",
                    "price": {"amount": 250.50, "currency": "USD"},
                    "source": {"code": "LHR", "name": "London Heathrow"},
                    "destination": {"code": "DBV", "name": "Dubrovnik Airport"},
                }
            ],
            "currency": "USD",
            "total_results": 1,
        }

        with patch("src.app.api.v1.flights.flight_service") as mock_service:
            mock_service.search_round_trip = AsyncMock(return_value=mock_response)

            with patch("src.app.api.v1.flights.cache") as mock_cache:
                # Mock the cache decorator to just call the function
                mock_cache.return_value = lambda f: f

                result = await search_round_trip_flights(
                    request=mock_request,
                    source="Country:GB",
                    destination="City:dubrovnik_hr",
                    currency="usd",
                    locale="en",
                    adults=1,
                    children=0,
                    infants=0,
                    handbags=1,
                    holdbags=0,
                    cabin_class="ECONOMY",
                    sort_by="QUALITY",
                    sort_order="ASCENDING",
                    apply_mixed_classes=True,
                    allow_return_from_different_city=True,
                    allow_change_inbound_destination=True,
                    allow_change_inbound_source=True,
                    allow_different_station_connection=True,
                    enable_self_transfer=True,
                    allow_overnight_stopover=True,
                    enable_true_hidden_city=True,
                    enable_throw_away_ticketing=True,
                    price_start=None,
                    price_end=None,
                    max_stops_count=None,
                    outbound=None,
                    transport_types="FLIGHT",
                    content_providers=None,
                    limit=20,
                    inbound_departure_date_start=None,
                    inbound_departure_date_end=None,
                    outbound_department_date_start=None,
                    outbound_department_date_end=None,
                )

                assert result == mock_response
                assert result["total_results"] == 1
                assert len(result["data"]) == 1

    @pytest.mark.asyncio
    async def test_search_round_trip_timeout(self):
        """Test round-trip search with timeout error."""
        mock_request = Mock()
        mock_request.method = "GET"

        with patch("src.app.api.v1.flights.flight_service") as mock_service:
            mock_service.search_round_trip = AsyncMock(
                side_effect=FlightServiceError("Flight search request timed out", 408)
            )

            with patch("src.app.api.v1.flights.cache") as mock_cache:
                mock_cache.return_value = lambda f: f

                with pytest.raises(FlightServiceError) as exc_info:
                    await search_round_trip_flights(
                        request=mock_request,
                        source="Country:GB",
                        destination="City:dubrovnik_hr",
                        currency="usd",
                        locale="en",
                        adults=1,
                        children=0,
                        infants=0,
                        handbags=1,
                        holdbags=0,
                        cabin_class="ECONOMY",
                        sort_by="QUALITY",
                        sort_order="ASCENDING",
                        apply_mixed_classes=True,
                        allow_return_from_different_city=True,
                        allow_change_inbound_destination=True,
                        allow_change_inbound_source=True,
                        allow_different_station_connection=True,
                        enable_self_transfer=True,
                        allow_overnight_stopover=True,
                        enable_true_hidden_city=True,
                        enable_throw_away_ticketing=True,
                        price_start=None,
                        price_end=None,
                        max_stops_count=None,
                        outbound=None,
                        transport_types="FLIGHT",
                        content_providers=None,
                        limit=20,
                        inbound_departure_date_start=None,
                        inbound_departure_date_end=None,
                        outbound_department_date_start=None,
                        outbound_department_date_end=None,
                    )

                assert exc_info.value.status_code == 408

    @pytest.mark.asyncio
    async def test_search_round_trip_connection_error(self):
        """Test round-trip search with connection error."""
        mock_request = Mock()
        mock_request.method = "GET"

        with patch("src.app.api.v1.flights.flight_service") as mock_service:
            mock_service.search_round_trip = AsyncMock(
                side_effect=FlightServiceError("Unable to connect to flight search service", 503)
            )

            with patch("src.app.api.v1.flights.cache") as mock_cache:
                mock_cache.return_value = lambda f: f

                with pytest.raises(FlightServiceError) as exc_info:
                    await search_round_trip_flights(
                        request=mock_request,
                        source="Country:GB",
                        destination="City:dubrovnik_hr",
                        currency="usd",
                        locale="en",
                        adults=1,
                        children=0,
                        infants=0,
                        handbags=1,
                        holdbags=0,
                        cabin_class="ECONOMY",
                        sort_by="QUALITY",
                        sort_order="ASCENDING",
                        apply_mixed_classes=True,
                        allow_return_from_different_city=True,
                        allow_change_inbound_destination=True,
                        allow_change_inbound_source=True,
                        allow_different_station_connection=True,
                        enable_self_transfer=True,
                        allow_overnight_stopover=True,
                        enable_true_hidden_city=True,
                        enable_throw_away_ticketing=True,
                        price_start=None,
                        price_end=None,
                        max_stops_count=None,
                        outbound=None,
                        transport_types="FLIGHT",
                        content_providers=None,
                        limit=20,
                        inbound_departure_date_start=None,
                        inbound_departure_date_end=None,
                        outbound_department_date_start=None,
                        outbound_department_date_end=None,
                    )

                assert exc_info.value.status_code == 503


class TestSearchOneWayFlights:
    """Test one-way flight search endpoint."""

    @pytest.mark.asyncio
    async def test_search_one_way_success(self):
        """Test successful one-way flight search."""
        mock_request = Mock()
        mock_request.method = "GET"

        mock_response = {
            "data": [
                {
                    "id": "flight456",
                    "price": {"amount": 150.00, "currency": "USD"},
                    "source": {"code": "LHR", "name": "London Heathrow"},
                    "destination": {"code": "CDG", "name": "Paris Charles de Gaulle"},
                }
            ],
            "currency": "USD",
            "total_results": 1,
        }

        with patch("src.app.api.v1.flights.flight_service") as mock_service:
            mock_service.search_one_way = AsyncMock(return_value=mock_response)

            with patch("src.app.api.v1.flights.cache") as mock_cache:
                mock_cache.return_value = lambda f: f

                result = await search_one_way_flights(
                    request=mock_request,
                    source="City:london_gb",
                    destination="City:paris_fr",
                    currency="usd",
                    locale="en",
                    adults=2,
                    children=0,
                    infants=0,
                    handbags=1,
                    holdbags=0,
                    cabin_class="ECONOMY",
                    sort_by="PRICE",
                    sort_order="ASCENDING",
                    apply_mixed_classes=True,
                    allow_return_from_different_city=True,
                    allow_change_inbound_destination=True,
                    allow_change_inbound_source=True,
                    allow_different_station_connection=True,
                    enable_self_transfer=True,
                    allow_overnight_stopover=True,
                    enable_true_hidden_city=True,
                    enable_throw_away_ticketing=True,
                    price_start=None,
                    price_end=None,
                    max_stops_count=1,
                    outbound=None,
                    transport_types="FLIGHT",
                    content_providers=None,
                    limit=10,
                    departure_date_start=None,
                    departure_date_end=None,
                )

                assert result == mock_response
                assert result["total_results"] == 1
                assert len(result["data"]) == 1

    @pytest.mark.asyncio
    async def test_search_one_way_with_filters(self):
        """Test one-way search with price and stops filters."""
        mock_request = Mock()
        mock_request.method = "GET"

        mock_response = {
            "data": [
                {
                    "id": "flight789",
                    "price": {"amount": 120.00, "currency": "EUR"},
                    "source": {"code": "BER", "name": "Berlin Brandenburg"},
                    "destination": {"code": "AMS", "name": "Amsterdam Schiphol"},
                }
            ],
            "currency": "EUR",
            "total_results": 1,
        }

        with patch("src.app.api.v1.flights.flight_service") as mock_service:
            mock_service.search_one_way = AsyncMock(return_value=mock_response)

            with patch("src.app.api.v1.flights.cache") as mock_cache:
                mock_cache.return_value = lambda f: f

                result = await search_one_way_flights(
                    request=mock_request,
                    source="City:berlin_de",
                    destination="City:amsterdam_nl",
                    currency="eur",
                    locale="en",
                    adults=1,
                    children=0,
                    infants=0,
                    handbags=1,
                    holdbags=1,
                    cabin_class="ECONOMY",
                    sort_by="PRICE",
                    sort_order="ASCENDING",
                    apply_mixed_classes=True,
                    allow_return_from_different_city=True,
                    allow_change_inbound_destination=True,
                    allow_change_inbound_source=True,
                    allow_different_station_connection=True,
                    enable_self_transfer=True,
                    allow_overnight_stopover=True,
                    enable_true_hidden_city=True,
                    enable_throw_away_ticketing=True,
                    price_start=50,
                    price_end=200,
                    max_stops_count=0,
                    outbound=None,
                    transport_types="FLIGHT",
                    content_providers=None,
                    limit=20,
                    departure_date_start="2024-07-15T00:00:00",
                    departure_date_end="2024-07-18T00:00:00",
                )

                assert result == mock_response
                assert result["currency"] == "EUR"