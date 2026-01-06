from typing import Any

from fastapi import APIRouter, Depends, Query, Request

from ...api.dependencies import rate_limiter_dependency
from ...core.utils.cache import cache
from ...schemas.flight import OneWaySearchRequest, RoundTripSearchRequest
from ...services.flight_service import flight_service

router = APIRouter(prefix="/flights", tags=["flights"])


@router.get("/search/round-trip")
@cache(key_prefix="round_trip_flights:{source}_{destination}", expiration=1800)
async def search_round_trip_flights(
    request: Request,
    source: str = Query(..., description="Origin location (e.g., Country:GB, City:london_gb)"),
    destination: str = Query(..., description="Destination location (e.g., City:dubrovnik_hr, Country:DE)"),
    currency: str = Query(default="usd", description="Currency code"),
    locale: str = Query(default="en", description="Locale code"),
    adults: int = Query(default=1, ge=1, le=9, description="Number of adults"),
    children: int = Query(default=0, ge=0, le=9, description="Number of children"),
    infants: int = Query(default=0, ge=0, le=9, description="Number of infants"),
    handbags: int = Query(default=1, ge=0, le=5, description="Number of handbags"),
    holdbags: int = Query(default=0, ge=0, le=5, description="Number of hold bags"),
    cabin_class: str = Query(default="ECONOMY", description="Cabin class"),
    sort_by: str = Query(default="QUALITY", description="Sort by field"),
    sort_order: str = Query(default="ASCENDING", description="Sort order"),
    apply_mixed_classes: bool = Query(default=True),
    allow_return_from_different_city: bool = Query(default=True),
    allow_change_inbound_destination: bool = Query(default=True),
    allow_change_inbound_source: bool = Query(default=True),
    allow_different_station_connection: bool = Query(default=True),
    enable_self_transfer: bool = Query(default=True),
    allow_overnight_stopover: bool = Query(default=True),
    enable_true_hidden_city: bool = Query(default=True),
    enable_throw_away_ticketing: bool = Query(default=True),
    price_start: int | None = Query(default=None, ge=0, description="Minimum price"),
    price_end: int | None = Query(default=None, ge=0, description="Maximum price"),
    max_stops_count: int | None = Query(default=None, ge=0, le=2, description="Maximum stops"),
    outbound: str | None = Query(default=None, description="Outbound days (e.g., MONDAY,FRIDAY)"),
    transport_types: str = Query(default="FLIGHT", description="Transport types"),
    content_providers: str | None = Query(default=None, description="Content providers"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of results"),
    inbound_departure_date_start: str | None = Query(default=None, description="Inbound start date"),
    inbound_departure_date_end: str | None = Query(default=None, description="Inbound end date"),
    outbound_department_date_start: str | None = Query(default=None, description="Outbound start date"),
    outbound_department_date_end: str | None = Query(default=None, description="Outbound end date"),
) -> dict[str, Any]:
    """Search for round-trip flights.

    Returns a list of available round-trip flight options based on search criteria.
    Results are cached for 30 minutes to improve performance.

    Parameters
    ----------
    request: Request
        FastAPI request object
    source: str
        Origin location (Country:GB or City:london_gb)
    destination: str
        Destination location (City:dubrovnik_hr or Country:DE)
    currency: str
        Currency code (default: usd)
    adults: int
        Number of adult passengers (default: 1)
    ... (other parameters as documented)

    Returns
    -------
    Dict[str, Any]
        Flight search results from API

    Raises
    ------
    FlightServiceError
        If the flight search fails
    """
    search_request = RoundTripSearchRequest(
        source=source,
        destination=destination,
        currency=currency,
        locale=locale,
        adults=adults,
        children=children,
        infants=infants,
        handbags=handbags,
        holdbags=holdbags,
        cabin_class=cabin_class,
        sort_by=sort_by,
        sort_order=sort_order,
        apply_mixed_classes=apply_mixed_classes,
        allow_return_from_different_city=allow_return_from_different_city,
        allow_change_inbound_destination=allow_change_inbound_destination,
        allow_change_inbound_source=allow_change_inbound_source,
        allow_different_station_connection=allow_different_station_connection,
        enable_self_transfer=enable_self_transfer,
        allow_overnight_stopover=allow_overnight_stopover,
        enable_true_hidden_city=enable_true_hidden_city,
        enable_throw_away_ticketing=enable_throw_away_ticketing,
        price_start=price_start,
        price_end=price_end,
        max_stops_count=max_stops_count,
        outbound=outbound,
        transport_types=transport_types,
        content_providers=content_providers,
        limit=limit,
        inbound_departure_date_start=inbound_departure_date_start,
        inbound_departure_date_end=inbound_departure_date_end,
        outbound_department_date_start=outbound_department_date_start,
        outbound_department_date_end=outbound_department_date_end,
    )

    data = await flight_service.search_round_trip(search_request.model_dump())
    return data


@router.get("/search/one-way")
@cache(key_prefix="one_way_flights:{source}_{destination}", expiration=1800)
async def search_one_way_flights(
    request: Request,
    source: str = Query(..., description="Origin location (e.g., Country:GB, City:london_gb)"),
    destination: str = Query(..., description="Destination location (e.g., City:dubrovnik_hr, Country:DE)"),
    currency: str = Query(default="usd", description="Currency code"),
    locale: str = Query(default="en", description="Locale code"),
    adults: int = Query(default=1, ge=1, le=9, description="Number of adults"),
    children: int = Query(default=0, ge=0, le=9, description="Number of children"),
    infants: int = Query(default=0, ge=0, le=9, description="Number of infants"),
    handbags: int = Query(default=1, ge=0, le=5, description="Number of handbags"),
    holdbags: int = Query(default=0, ge=0, le=5, description="Number of hold bags"),
    cabin_class: str = Query(default="ECONOMY", description="Cabin class"),
    sort_by: str = Query(default="QUALITY", description="Sort by field"),
    sort_order: str = Query(default="ASCENDING", description="Sort order"),
    apply_mixed_classes: bool = Query(default=True),
    allow_return_from_different_city: bool = Query(default=True),
    allow_change_inbound_destination: bool = Query(default=True),
    allow_change_inbound_source: bool = Query(default=True),
    allow_different_station_connection: bool = Query(default=True),
    enable_self_transfer: bool = Query(default=True),
    allow_overnight_stopover: bool = Query(default=True),
    enable_true_hidden_city: bool = Query(default=True),
    enable_throw_away_ticketing: bool = Query(default=True),
    price_start: int | None = Query(default=None, ge=0, description="Minimum price"),
    price_end: int | None = Query(default=None, ge=0, description="Maximum price"),
    max_stops_count: int | None = Query(default=None, ge=0, le=2, description="Maximum stops"),
    outbound: str | None = Query(default=None, description="Outbound days (e.g., MONDAY,FRIDAY)"),
    transport_types: str = Query(default="FLIGHT", description="Transport types"),
    content_providers: str | None = Query(default=None, description="Content providers"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of results"),
    departure_date_start: str | None = Query(default=None, description="Departure start date"),
    departure_date_end: str | None = Query(default=None, description="Departure end date"),
) -> dict[str, Any]:
    """Search for one-way flights.

    Returns a list of available one-way flight options based on search criteria.
    Results are cached for 30 minutes to improve performance.

    Parameters
    ----------
    request: Request
        FastAPI request object
    source: str
        Origin location (Country:GB or City:london_gb)
    destination: str
        Destination location (City:dubrovnik_hr or Country:DE)
    currency: str
        Currency code (default: usd)
    adults: int
        Number of adult passengers (default: 1)
    ... (other parameters as documented)

    Returns
    -------
    Dict[str, Any]
        Flight search results from API

    Raises
    ------
    FlightServiceError
        If the flight search fails
    """
    search_request = OneWaySearchRequest(
        source=source,
        destination=destination,
        currency=currency,
        locale=locale,
        adults=adults,
        children=children,
        infants=infants,
        handbags=handbags,
        holdbags=holdbags,
        cabin_class=cabin_class,
        sort_by=sort_by,
        sort_order=sort_order,
        apply_mixed_classes=apply_mixed_classes,
        allow_return_from_different_city=allow_return_from_different_city,
        allow_change_inbound_destination=allow_change_inbound_destination,
        allow_change_inbound_source=allow_change_inbound_source,
        allow_different_station_connection=allow_different_station_connection,
        enable_self_transfer=enable_self_transfer,
        allow_overnight_stopover=allow_overnight_stopover,
        enable_true_hidden_city=enable_true_hidden_city,
        enable_throw_away_ticketing=enable_throw_away_ticketing,
        price_start=price_start,
        price_end=price_end,
        max_stops_count=max_stops_count,
        outbound=outbound,
        transport_types=transport_types,
        content_providers=content_providers,
        limit=limit,
        departure_date_start=departure_date_start,
        departure_date_end=departure_date_end,
    )

    data = await flight_service.search_one_way(search_request.model_dump())
    return data