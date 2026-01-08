export interface Segment {
  departureTime: string;
  arrivalTime: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  duration: string;
  durationMinutes: number;
  carrier: string;
  carrierCode: string;
  flightNumber: string;
  cabinClass: string;
}

export interface Layover {
  airport: string;
  airportCode: string;
  duration: string;
  durationMinutes: number;
}

export interface BaggageInfo {
  cabinBag: number;
  checkedBag: number;
  cabinBagIncluded?: number;
  checkedBagIncluded?: number;
  cabinBagPrice?: number;
  checkedBagPrice?: number;
}

export interface Leg {
  departureTime: string;
  arrivalTime: string;
  departureDate?: string;
  arrivalDate?: string;
  duration: string;
  durationMinutes: number;
  origin: string;
  originCode?: string;
  destination: string;
  destinationCode?: string;
  carrier: string;
  carrierCode?: string;
  carrierLogo?: string;
  stops: number;
  stopAirports?: string[];
  isOvernight?: boolean;
  segments?: Segment[];
  layovers?: Layover[];
}

export interface Flight {
  id: string;
  price: number;
  currency: string;
  outbound: Leg;
  inbound?: Leg;
  tags?: string[]; // e.g., "Cheapest", "Best"
  dealRating?: string; // e.g., "AVERAGE PRICE 442 $"
  baggageInfo?: BaggageInfo;
  bookingUrl?: string;
  isSelfTransfer?: boolean;
  isVirtualInterlining?: boolean;
}

export enum SortOption {
  BEST = 'BEST',
  CHEAPEST = 'CHEAPEST',
  FASTEST = 'FASTEST'
}

export interface TimeRange {
  start: number; // minutes from midnight
  end: number;
}

export interface FilterState {
  priceAlerts: boolean;
  bags: {
    cabin: number;
    checked: number;
  };
  stops: {
    any: boolean;
    direct: boolean;
    upTo1: boolean;
    upTo2: boolean;
    allowOvernight: boolean;
  };
  connections: {
    selfTransfer: boolean;
    returnDiffStation: boolean;
    returnToDiffStation: boolean;
  };
  carriers: string[];
  travelHacks: {
    selfTransfer: boolean;
    throwawayTicketing: boolean;
    hiddenCities: boolean;
  };
  excludeCountries: string[];
  times: {
    departure: TimeRange;
    arrival: TimeRange;
  };
  maxDuration: number | null; // minutes
  stopoverDuration: TimeRange; // hours
  maxPrice: number;
  days: {
    departure: number[]; // 0-6
    return: number[];
  };
}
