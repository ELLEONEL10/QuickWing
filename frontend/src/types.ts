export interface Leg {
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  origin: string;
  destination: string;
  carrier: string;
  carrierCode?: string;
  carrierLogo?: string;
  stops: number;
  stopAirports?: string[];
  isOvernight?: boolean;
}

export interface Flight {
  id: string;
  price: number;
  currency: string;
  outbound: Leg;
  inbound: Leg;
  tags?: string[]; // e.g., "Cheapest", "Best"
  dealRating?: string; // e.g., "AVERAGE PRICE 442 $"
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
