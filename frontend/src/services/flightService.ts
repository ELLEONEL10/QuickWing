import { Flight, Leg, FilterState } from '../types';
import { API_URL } from '../config';

interface ApiFlightResponse {
  data: any[];
  currency: string;
  _results: number;
}

const mapLeg = (route: any[]): Leg => {
    // This is a simplified mapper assuming the API returns a list of segments in 'route'
    // We take the first segment as origin and last as destination for the leg summary
    const firstSegment = route[0];
    const lastSegment = route[route.length - 1];

    const departureTime = new Date(firstSegment.local_departure || firstSegment.dTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrivalTime = new Date(lastSegment.local_arrival || lastSegment.aTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Calculate duration
    const totalSeconds = (lastSegment.aTime || 0) - (firstSegment.dTime || 0);
    const durationHours = Math.floor(totalSeconds / 3600);
    const durationMinutes = Math.floor((totalSeconds % 3600) / 60);

    return {
        departureTime,
        arrivalTime,
        duration: `${durationHours}h ${durationMinutes}m`,
        durationMinutes: Math.floor(totalSeconds / 60),
        origin: firstSegment.cityFrom || firstSegment.flyFrom,
        destination: lastSegment.cityTo || lastSegment.flyTo,
        carrier: firstSegment.airline || "Airline", 
        stops: route.length - 1,
        stopAirports: route.slice(0, -1).map((r: any) => r.cityTo)
    };
};

export const searchFlights = async (
    from: string, 
    to: string, 
    passengers: number = 1, 
    flightClass: string = 'ECONOMY',
    departureDate?: string,
    returnDate?: string,
    filters?: FilterState // Add filters parameter
): Promise<Flight[]> => {
    try {
        // 1. Map basic parameters
        const params: Record<string, string> = {
            source: from,
            destination: to,
            adults: passengers.toString(),
            cabin_class: flightClass.toUpperCase(),
            limit: '50' // Increased limit
        };

        // 2. Map Dates
        if (departureDate) {
            params.outbound_department_date_start = departureDate;
            params.outbound_department_date_end = departureDate;
        }

        if (returnDate) {
            params.inbound_departure_date_start = returnDate;
            params.inbound_departure_date_end = returnDate;
        }

            // Maps Filters to Backend Query Params
        if (filters) {
            // Price Filter
            if (filters.maxPrice) {
                params.price_end = filters.maxPrice.toString();
            }

            // Stops Filter
            if (!filters.stops.any) {
                if (filters.stops.direct) params.max_stops_count = '0';
                else if (filters.stops.upTo1) params.max_stops_count = '1';
                else if (filters.stops.upTo2) params.max_stops_count = '2';
            }

            if (!filters.stops.allowOvernight) {
                params.allow_overnight_stopover = 'false';
            }

            // Bags Filter
            if (filters.bags.cabin > 0) {
                params.handbags = '1';
            }
            if (filters.bags.checked > 0) {
                params.holdbags = '1';
            }

            // Connection Filters
            if (filters.connections) {
                params.enable_self_transfer = filters.connections.selfTransfer ? 'true' : 'false';
            }

            // Travel Hacks (Kiwi specific)
            if (filters.travelHacks) {
                params.enable_throw_away_ticketing = filters.travelHacks.throwawayTicketing ? 'true' : 'false';
                params.enable_true_hidden_city = filters.travelHacks.hiddenCities ? 'true' : 'false';
            }
        }

        const queryParams = new URLSearchParams(params);

        // Determine endpoint based on dates (Round Trip vs One Way)
        const endpoint = returnDate ? '/flights/search/round-trip' : '/flights/search/one-way';

        const response = await fetch(`${API_URL}${endpoint}?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data: ApiFlightResponse = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            return [];
        }

        // Map response
        return data.data.map((item: any) => ({
            id: item.id,
            price: item.price,
            currency: data.currency || "USD",
            dealRating: "Good Price", 
            outbound: mapLeg(item.route?.filter((r: any) => r.return === 0) || []),
            inbound: mapLeg(item.route?.filter((r: any) => r.return === 1) || []),
            tags: []
        }));

    } catch (error) {
        console.error("Failed to fetch flights", error);
        return [];
    }
};
