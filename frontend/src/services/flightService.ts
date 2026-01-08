import { Flight, Leg, FilterState } from '../types';
import { API_URL } from '../config';

const mapSector = (sector: any): Leg => {
  if (!sector || !sector.sectorSegments || sector.sectorSegments.length === 0) {
      // Fallback or empty leg
      return {
          departureTime: '',
          arrivalTime: '',
          duration: '',
          durationMinutes: 0,
          origin: '',
          destination: '',
          carrier: '',
          stops: 0,
          stopAirports: [],
          isOvernight: false
      };
  }
  const segments = sector.sectorSegments;
  const firstSegment = segments[0].segment;
  const lastSegment = segments[segments.length - 1].segment;

  // Calculate total duration from sector duration (seconds)
  const totalSeconds = sector.duration;
  const durationHours = Math.floor(totalSeconds / 3600);
  const durationMinutes = Math.floor((totalSeconds % 3600) / 60);

  const depDate = new Date(firstSegment.source.localTime);
  const arrDate = new Date(lastSegment.destination.localTime);
  const isOvernight = arrDate.getDate() !== depDate.getDate();

  return {
      departureTime: depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      arrivalTime: arrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${durationHours}h ${durationMinutes}m`,
      durationMinutes: Math.floor(totalSeconds / 60),
      origin: firstSegment.source.station?.city?.name || firstSegment.source.station?.name || 'Unknown', 
      destination: lastSegment.destination.station?.city?.name || lastSegment.destination.station?.name || 'Unknown',
      carrier: firstSegment.carrier.name, 
      carrierCode: firstSegment.carrier.code,
      carrierLogo: firstSegment.carrier.name, 
      stops: segments.length - 1,
      stopAirports: segments.slice(0, -1).map((s: any) => s.segment.destination.station?.city?.name || s.segment.destination.station?.name || ''),
      isOvernight: isOvernight
  };
};

const formatDateForApi = (isoDate: string): string => {
    if (!isoDate) return '';
    // Expecting YYYY-MM-DD
    const parts = isoDate.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
};

export const searchFlights = async (
    from: string, 
    to: string, 
    passengers: number = 1, 
    flightClass: string = 'ECONOMY',
    departureDate?: string,
    returnDate?: string,
    filters?: FilterState 
): Promise<Flight[]> => {
    try {
        const params: Record<string, string> = {
            source: from,
            destination: to,
            adults: passengers.toString(),
            cabin_class: flightClass.toUpperCase(),
            limit: '50',
            currency: 'USD'
        };

        const isRoundTrip = !!returnDate;

        if (departureDate) {
            const formattedDep = formatDateForApi(departureDate);
            if (isRoundTrip) {
                params.outbound_department_date_start = formattedDep;
                params.outbound_department_date_end = formattedDep;
            } else {
                params.departure_date_start = formattedDep;
                params.departure_date_end = formattedDep;
            }
        }

        if (returnDate) {
            const formattedRet = formatDateForApi(returnDate);
            params.inbound_departure_date_start = formattedRet;
            params.inbound_departure_date_end = formattedRet;
        }

        if (filters) {
            if (filters.maxPrice) {
                params.price_end = filters.maxPrice.toString();
            }

            if (filters.stops && !filters.stops.any) {
                if (filters.stops.direct) params.max_stops_count = '0';
                else if (filters.stops.upTo1) params.max_stops_count = '1';
                else if (filters.stops.upTo2) params.max_stops_count = '2';
            }

            if (filters.stops && !filters.stops.allowOvernight) {
                params.allow_overnight_stopover = 'false';
            }

            if (filters.bags && filters.bags.cabin > 0) {
                params.handbags = '1';
            }
            if (filters.bags && filters.bags.checked > 0) {
                params.holdbags = '1';
            }

            if (filters.connections) {
                params.enable_self_transfer = filters.connections.selfTransfer ? 'true' : 'false';
            }

            if (filters.travelHacks) {
                params.enable_throw_away_ticketing = filters.travelHacks.throwawayTicketing ? 'true' : 'false';
                params.enable_true_hidden_city = filters.travelHacks.hiddenCities ? 'true' : 'false';
            }
        }

        const queryParams = new URLSearchParams(params);
        const endpoint = isRoundTrip ? '/flights/search/round-trip' : '/flights/search/one-way';

        const response = await fetch(`${API_URL}${endpoint}?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Handle the new API structure which uses 'itineraries'
        if (!data.itineraries || !Array.isArray(data.itineraries)) {
            // Check if it's the old structure? Or just log and return empty
            console.warn("Unexpected API response structure", data);
            return [];
        }

        return data.itineraries.map((item: any) => ({
            id: item.id,
            price: parseFloat(item.price.amount),
            currency: item.price.currency || "USD",
            dealRating: "Good Price", 
            outbound: mapSector(item.outbound),
            inbound: item.inbound ? mapSector(item.inbound) : (isRoundTrip ? mapSector(item.outbound) : undefined), // Fallback to outbound if inbound missing in roundtrip (unlikely but safe)
            tags: []
        }));

    } catch (error) {
        console.error("Failed to fetch flights", error);
        return [];
    }
};
