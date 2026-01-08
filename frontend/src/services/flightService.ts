import { Flight, Leg, FilterState } from '../types';
import { API_URL } from '../config';

const formatTime = (dateInput: string | number) => {
    if (!dateInput) return '';
    try {
        let date: Date;
        // Handle Unix timestamp (seconds)
        if (typeof dateInput === 'number') {
            date = new Date(dateInput * 1000);
        } else {
            date = new Date(dateInput);
        }
        
        if (isNaN(date.getTime())) return String(dateInput); 
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
        return '';
    }
};

const calculateDuration = (start: string | number, end: string | number): { text: string; minutes: number } => {
    try {
        let startTime: number;
        let endTime: number;

        if (typeof start === 'number') startTime = start * 1000;
        else startTime = new Date(start).getTime();

        if (typeof end === 'number') endTime = end * 1000;
        else endTime = new Date(end).getTime();

        if (isNaN(startTime) || isNaN(endTime)) return { text: 'N/A', minutes: 0 };
        
        const diffMs = endTime - startTime;
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return { text: `${hours}h ${mins}m`, minutes };
    } catch (e) {
        return { text: '', minutes: 0 };
    }
};

/**
 * Process a sector (outbound or inbound) from the Kiwi.com API response.
 * The API returns sectorSegments array where each item has a 'segment' object.
 */
const processSector = (sector: any): Leg => {
    if (!sector || !sector.sectorSegments || sector.sectorSegments.length === 0) {
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
        } as Leg;
    }

    const segments = sector.sectorSegments;
    const firstSegment = segments[0].segment;
    const lastSegment = segments[segments.length - 1].segment;

    // Extract times from the API structure
    const depTimeVal = firstSegment.source?.localTime;
    const arrTimeVal = lastSegment.destination?.localTime;

    // Duration is provided in seconds by the API
    const totalDurationSeconds = sector.duration || 0;
    const durationMins = Math.floor(totalDurationSeconds / 60);
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;
    const durationText = `${hours}h ${mins}m`;

    let isOvernight = false;
    try {
        if (depTimeVal && arrTimeVal) {
            const dDate = new Date(depTimeVal);
            const aDate = new Date(arrTimeVal);
            isOvernight = aDate.getDate() !== dDate.getDate();
        }
    } catch (e) { /* ignore */ }

    // Airline info from carrier object
    const airlineCode = firstSegment.carrier?.code || '??';
    const airlineName = firstSegment.carrier?.name || airlineCode;

    // Extract city/airport info
    const originCity = firstSegment.source?.station?.city?.name || '';
    const originCode = firstSegment.source?.station?.code || '';
    const destCity = lastSegment.destination?.station?.city?.name || '';
    const destCode = lastSegment.destination?.station?.code || '';

    // Get stop airports (intermediate destinations)
    const stopAirports = segments.slice(0, -1).map((s: any) => 
        s.segment?.destination?.station?.city?.name || s.segment?.destination?.station?.code || ''
    );

    return {
        departureTime: formatTime(depTimeVal),
        arrivalTime: formatTime(arrTimeVal),
        duration: durationText,
        durationMinutes: durationMins,
        origin: originCity || originCode,
        destination: destCity || destCode,
        carrier: airlineName, 
        carrierCode: airlineCode,
        carrierLogo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`, 
        stops: Math.max(0, segments.length - 1),
        stopAirports,
        isOvernight
    };
};

// Keep the old function name as an alias for backward compatibility
const processLeg = processSector;

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
        const isRoundTrip = !!returnDate;
        const endpoint = isRoundTrip ? '/flights/search/round-trip' : '/flights/search/one-way';
        
        const params: any = {
            source: from,
            destination: to,
            adults: passengers.toString(),
            cabin_class: flightClass.toUpperCase(),
            limit: '50',
            currency: 'USD'
        };

        if (departureDate) {
            if (isRoundTrip) {
                params.outbound_department_date_start = departureDate;
                params.outbound_department_date_end = departureDate;
            } else {
                params.departure_date_start = departureDate;
                params.departure_date_end = departureDate;
            }
        }

        if (isRoundTrip && returnDate) {
            params.inbound_departure_date_start = returnDate;
            params.inbound_departure_date_end = returnDate;
        }

        if (filters) {
            if (filters.maxPrice) params.price_end = filters.maxPrice;
        }

        const queryString = new URLSearchParams(params).toString();
        // LOGGING REQUEST
        console.log(`[FlightService] Fetching: ${API_URL}${endpoint}?${queryString}`);
        
        const response = await fetch(`${API_URL}${endpoint}?${queryString}`);

        if (!response.ok) {
            console.error(`[FlightService] API Error: ${response.status} ${response.statusText}`);
            throw new Error('Network response was not ok');
        }

        const json = await response.json();
        // LOGGING RESPONSE STRUCTURE
        console.log("[FlightService] Raw JSON:", json);

        // Kiwi.com RapidAPI returns data in 'itineraries' array, not 'data'
        const rawData = Array.isArray(json.itineraries) 
            ? json.itineraries 
            : (Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []));
        console.log(`[FlightService] Found ${rawData.length} flight items`);

        return rawData.map((item: any) => {
            // Kiwi.com API returns different structures for round-trip vs one-way:
            // - Round-trip: 'outbound' and 'inbound' sector objects
            // - One-way: 'sector' object
            // Each sector has 'sectorSegments' array with flight segments
            const outboundSector = item.outbound || item.sector;
            const inboundSector = item.inbound;

            // Price is nested in { amount: "43.8055" } format
            const priceVal = item.price?.amount || item.price || 0;

            // Get currency - API returns USD prices when requested
            const currency = 'USD';

            return {
                id: item.id || item.legacyId || `flight-${Date.now()}-${Math.random()}`,
                price: parseFloat(priceVal),
                currency: currency,
                dealRating: 'Good Price',
                outbound: processSector(outboundSector),
                inbound: isRoundTrip && inboundSector ? processSector(inboundSector) : undefined,
                tags: []
            };
        });

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
};