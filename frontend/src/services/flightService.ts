import { Flight, Leg } from '../types';
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
    returnDate?: string
): Promise<Flight[]> => {
    try {
        const params: Record<string, string> = {
            source: from,
            destination: to,
            adults: passengers.toString(),
            cabin_class: flightClass.toUpperCase(),
            limit: '20'
        };

        if (departureDate) {
            params.outbound_department_date_start = departureDate;
            params.outbound_department_date_end = departureDate;
        }

        if (returnDate) {
            params.inbound_departure_date_start = returnDate;
            params.inbound_departure_date_end = returnDate;
        }

        const queryParams = new URLSearchParams(params);

        // Use One-Way or Round-Trip based on logic. For now, defaulting to Round-Trip search endpoint as used in example
        // But if dates are missing it might fail. Let's assume generic search. 
        // NOTE: The backend endpoint is /flights/search/round-trip 
        const response = await fetch(`${API_URL}/flights/search/round-trip?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization if needed
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data: ApiFlightResponse = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            return [];
        }

        return data.data.map((item: any) => ({
            id: item.id,
            price: item.price,
            currency: data.currency || "USD",
            dealRating: "Good Price", 
            outbound: mapLeg(item.route || []), // Needs proper route parsing for outbound/inbound splitting
            inbound: mapLeg(item.route || []), // Placeholder: Real API separates return legs
            tags: []
        }));

    } catch (error) {
        console.error("Failed to fetch flights", error);
        return [];
    }
};
