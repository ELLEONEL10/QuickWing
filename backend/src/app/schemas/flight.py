from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class FlightSearchBase(BaseModel):

    source: Annotated[str, Field(examples=["Country:GB", "City:london_gb"])]
    destination: Annotated[str, Field(examples=["City:dubrovnik_hr", "Country:DE"])]
    currency: Annotated[str, Field(default="usd", examples=["usd", "eur", "gbp"])]
    locale: Annotated[str, Field(default="en", examples=["en", "de", "fr"])]
    adults: Annotated[int, Field(default=1, ge=1, le=9, examples=[1])]
    children: Annotated[int, Field(default=0, ge=0, le=9, examples=[0])]
    infants: Annotated[int, Field(default=0, ge=0, le=9, examples=[0])]
    handbags: Annotated[int, Field(default=1, ge=0, le=5, examples=[1])]
    holdbags: Annotated[int, Field(default=0, ge=0, le=5, examples=[0])]
    cabin_class: Annotated[
        str, Field(default="ECONOMY", examples=["ECONOMY", "ECONOMY_PREMIUM", "BUSINESS", "FIRST_CLASS"])
    ]
    sort_by: Annotated[
        str, Field(default="QUALITY",
                   examples=["QUALITY", "PRICE", "DURATION", "SOURCE_TAKEOFF", "DESTINATION_LANDING"])
    ]
    sort_order: Annotated[str, Field(default="ASCENDING", examples=["ASCENDING", "DESCENDING"])]
    apply_mixed_classes: Annotated[bool, Field(default=True)]
    allow_return_from_different_city: Annotated[bool, Field(default=True)]
    allow_change_inbound_destination: Annotated[bool, Field(default=True)]
    allow_change_inbound_source: Annotated[bool, Field(default=True)]
    allow_different_station_connection: Annotated[bool, Field(default=True)]
    enable_self_transfer: Annotated[bool, Field(default=True)]
    allow_overnight_stopover: Annotated[bool, Field(default=True)]
    enable_true_hidden_city: Annotated[bool, Field(default=True)]
    enable_throw_away_ticketing: Annotated[bool, Field(default=True)]
    price_start: Annotated[int | None, Field(default=None, ge=0, examples=[100])]
    price_end: Annotated[int | None, Field(default=None, ge=0, examples=[1000])]
    max_stops_count: Annotated[int | None, Field(default=None, ge=0, le=2, examples=[1])]
    outbound: Annotated[
        str | None, Field(default=None, examples=["MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY"])
    ]
    transport_types: Annotated[str, Field(default="FLIGHT", examples=["FLIGHT", "BUS", "TRAIN"])]
    content_providers: Annotated[str | None, Field(default=None, examples=["FLIXBUS_DIRECTS,FRESH,KAYAK,KIWI"])]
    limit: Annotated[int, Field(default=20, ge=1, le=100, examples=[20])]


class RoundTripSearchRequest(FlightSearchBase):


    model_config = ConfigDict(extra="forbid")

    inbound_departure_date_start: Annotated[str | None, Field(default=None, examples=["2024-07-22T00:00:00"])]
    inbound_departure_date_end: Annotated[str | None, Field(default=None, examples=["2024-07-25T00:00:00"])]
    outbound_department_date_start: Annotated[str | None, Field(default=None, examples=["2024-07-15T00:00:00"])]
    outbound_department_date_end: Annotated[str | None, Field(default=None, examples=["2024-07-18T00:00:00"])]


class OneWaySearchRequest(FlightSearchBase):

    model_config = ConfigDict(extra="forbid")

    departure_date_start: Annotated[str | None, Field(default=None, examples=["2024-07-15T00:00:00"])]
    departure_date_end: Annotated[str | None, Field(default=None, examples=["2024-07-18T00:00:00"])]


class Airport(BaseModel):

    id: str | None = None
    name: str | None = None
    code: str | None = None
    city_name: str | None = None
    country_code: str | None = None


class Price(BaseModel):

    amount: float | None = None
    currency: str | None = None


class Route(BaseModel):

    id: str | None = None
    source: Airport | None = None
    destination: Airport | None = None
    departure: str | None = None
    arrival: str | None = None
    duration: str | None = None
    airline: str | None = None
    flight_number: str | None = None


class FlightSearchResponse(BaseModel):

    data: list[dict] | None = None
    total_results: int | None = None
    currency: str | None = None