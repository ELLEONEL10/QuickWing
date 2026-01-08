import { Flight, Leg, FilterState, Segment, Layover, BaggageInfo } from '../types';
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

const formatDurationFromSeconds = (seconds: number): { text: string; minutes: number } => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { text: `${hours}h ${mins}m`, minutes };
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
            isOvernight: false,
            segments: [],
            layovers: []
        } as Leg;
    }

    const sectorSegments = sector.sectorSegments;
    const firstSegment = sectorSegments[0].segment;
    const lastSegment = sectorSegments[sectorSegments.length - 1].segment;

    // Extract times from the API structure
    const depTimeVal = firstSegment.source?.localTime;
    const arrTimeVal = lastSegment.destination?.localTime;

    // Duration is provided in seconds by the API
    const totalDurationSeconds = sector.duration || 0;
    const { text: durationText, minutes: durationMins } = formatDurationFromSeconds(totalDurationSeconds);

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

    // Process detailed segments
    const segments: Segment[] = sectorSegments.map((ss: any) => {
        const seg = ss.segment;
        const segDuration = formatDurationFromSeconds(seg.duration || 0);
        return {
            departureTime: formatTime(seg.source?.localTime),
            arrivalTime: formatTime(seg.destination?.localTime),
            origin: seg.source?.station?.city?.name || seg.source?.station?.code || '',
            originCode: seg.source?.station?.code || '',
            destination: seg.destination?.station?.city?.name || seg.destination?.station?.code || '',
            destinationCode: seg.destination?.station?.code || '',
            duration: segDuration.text,
            durationMinutes: segDuration.minutes,
            carrier: seg.carrier?.name || seg.carrier?.code || '',
            carrierCode: seg.carrier?.code || '',
            flightNumber: `${seg.carrier?.code || ''}${seg.code || ''}`,
            cabinClass: seg.cabinClass || 'ECONOMY'
        };
    });

    // Process layovers (time between segments)
    const layovers: Layover[] = [];
    for (let i = 0; i < sectorSegments.length - 1; i++) {
        const currentSeg = sectorSegments[i];
        const nextSeg = sectorSegments[i + 1];
        
        // Layover info from the current segment's layover property or calculate from times
        if (currentSeg.layover) {
            const layoverDuration = formatDurationFromSeconds(currentSeg.layover.duration || 0);
            layovers.push({
                airport: currentSeg.segment?.destination?.station?.city?.name || '',
                airportCode: currentSeg.segment?.destination?.station?.code || '',
                duration: layoverDuration.text,
                durationMinutes: layoverDuration.minutes
            });
        } else {
            // Calculate layover from arrival to next departure
            const arrTime = new Date(currentSeg.segment?.destination?.localTime).getTime();
            const depTime = new Date(nextSeg.segment?.source?.localTime).getTime();
            if (!isNaN(arrTime) && !isNaN(depTime)) {
                const layoverMins = Math.floor((depTime - arrTime) / 60000);
                const hours = Math.floor(layoverMins / 60);
                const mins = layoverMins % 60;
                layovers.push({
                    airport: currentSeg.segment?.destination?.station?.city?.name || '',
                    airportCode: currentSeg.segment?.destination?.station?.code || '',
                    duration: `${hours}h ${mins}m`,
                    durationMinutes: layoverMins
                });
            }
        }
    }

    // Get stop airports (intermediate destinations)
    const stopAirports = sectorSegments.slice(0, -1).map((s: any) => 
        s.segment?.destination?.station?.city?.name || s.segment?.destination?.station?.code || ''
    );

    // Extract departure and arrival dates (ISO format for filtering)
    const departureDate = depTimeVal ? depTimeVal.split('T')[0] : undefined;
    const arrivalDate = arrTimeVal ? arrTimeVal.split('T')[0] : undefined;

    return {
        departureTime: formatTime(depTimeVal),
        arrivalTime: formatTime(arrTimeVal),
        departureDate,
        arrivalDate,
        duration: durationText,
        durationMinutes: durationMins,
        origin: originCity || originCode,
        originCode: originCode,
        destination: destCity || destCode,
        destinationCode: destCode,
        carrier: airlineName, 
        carrierCode: airlineCode,
        carrierLogo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`, 
        stops: Math.max(0, sectorSegments.length - 1),
        stopAirports,
        isOvernight,
        segments,
        layovers
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
            limit: '100', // Increased limit for more variety
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
        console.log("[FlightService] Raw JSON keys:", Object.keys(json));
        console.log("[FlightService] Raw JSON itineraries count:", json.itineraries?.length);
        console.log("[FlightService] First itinerary sample:", JSON.stringify(json.itineraries?.[0], null, 2)?.substring(0, 500));

        // Kiwi.com RapidAPI returns data in 'itineraries' array, not 'data'
        const rawData = Array.isArray(json.itineraries) 
            ? json.itineraries 
            : (Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []));
        console.log(`[FlightService] Found ${rawData.length} flight items to process`);

        // Check if all items have unique IDs
        const apiIds = rawData.map((item: any) => item.id || item.legacyId || 'no-id');
        console.log("[FlightService] API IDs:", apiIds);
        const uniqueApiIds = [...new Set(apiIds)];
        console.log("[FlightService] Unique API IDs:", uniqueApiIds.length);

        // First pass: deduplicate by API ID (fastest check)
        const seenApiIds = new Set<string>();
        const dedupedByApiId = rawData.filter((item: any) => {
            const apiId = item.id || item.legacyId || '';
            if (!apiId || seenApiIds.has(apiId)) {
                console.log(`[FlightService] Filtering out duplicate API ID: ${apiId?.substring(0, 50)}...`);
                return false;
            }
            seenApiIds.add(apiId);
            return true;
        });
        console.log(`[FlightService] After API ID dedup: ${dedupedByApiId.length} items`);

        // Process flights and create unique fingerprints to deduplicate similar flights
        const seenFlights = new Set<string>();
        const flights: Flight[] = [];

        for (let i = 0; i < dedupedByApiId.length; i++) {
            const item = dedupedByApiId[i];
            // Kiwi.com API returns different structures for round-trip vs one-way:
            // - Round-trip: 'outbound' and 'inbound' sector objects
            // - One-way: 'sector' object
            // Each sector has 'sectorSegments' array with flight segments
            const outboundSector = item.outbound || item.sector;
            const inboundSector = item.inbound;

            // Create a unique fingerprint for this flight based on actual flight details
            // This prevents showing duplicate flights even if they have different IDs
            const outboundSegments = outboundSector?.sectorSegments || [];
            const inboundSegments = inboundSector?.sectorSegments || [];
            
            const outboundFingerprint = outboundSegments.map((s: any) => {
                const seg = s.segment;
                return `${seg?.carrier?.code || ''}${seg?.code || ''}-${seg?.source?.localTime || ''}-${seg?.destination?.localTime || ''}`;
            }).join('|');
            
            const inboundFingerprint = inboundSegments.map((s: any) => {
                const seg = s.segment;
                return `${seg?.carrier?.code || ''}${seg?.code || ''}-${seg?.source?.localTime || ''}-${seg?.destination?.localTime || ''}`;
            }).join('|');
            
            const priceVal = item.price?.amount || item.price || 0;
            // Round price to nearest dollar for fingerprint to catch near-duplicates
            const flightFingerprint = `${outboundFingerprint}__${inboundFingerprint}__${Math.round(parseFloat(priceVal))}`;
            
            console.log(`[FlightService] Flight ${i} fingerprint: ${flightFingerprint.substring(0, 80)}...`);
            
            // Skip if we've already seen this exact flight (same route + similar price)
            if (seenFlights.has(flightFingerprint)) {
                console.log(`[FlightService] Skipping duplicate flight: ${flightFingerprint.substring(0, 80)}...`);
                continue;
            }
            seenFlights.add(flightFingerprint);

            // Price is nested in { amount: "43.8055" } format
            const currency = 'USD';

            // Extract baggage info
            const bagsInfo = item.bagsInfo || {};
            const baggageInfo: BaggageInfo = {
                cabinBag: bagsInfo.includedHandBags || 0,
                checkedBag: bagsInfo.includedCheckedBags || 0,
                cabinBagIncluded: bagsInfo.includedHandBags || 0,
                checkedBagIncluded: bagsInfo.includedCheckedBags || 0,
                cabinBagPrice: bagsInfo.handBagTiers?.[0]?.tierPrice?.amount 
                    ? parseFloat(bagsInfo.handBagTiers[0].tierPrice.amount) : undefined,
                checkedBagPrice: bagsInfo.checkedBagTiers?.[0]?.tierPrice?.amount 
                    ? parseFloat(bagsInfo.checkedBagTiers[0].tierPrice.amount) : undefined
            };

            // Extract travel hack info
            const travelHack = item.travelHack || {};
            const isSelfTransfer = travelHack.isVirtualInterlining || false;
            const isVirtualInterlining = travelHack.isVirtualInterlining || false;

            // Extract booking URL
            const bookingUrl = item.bookingOptions?.edges?.[0]?.node?.bookingUrl || '';

            // Generate a unique ID using the fingerprint hash or API ID
            const uniqueId = item.id || item.legacyId || `flight-${flightFingerprint.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)}`;

            flights.push({
                id: uniqueId,
                price: parseFloat(priceVal),
                currency: currency,
                dealRating: 'Good Price',
                outbound: processSector(outboundSector),
                inbound: isRoundTrip && inboundSector ? processSector(inboundSector) : undefined,
                tags: [],
                baggageInfo,
                bookingUrl,
                isSelfTransfer,
                isVirtualInterlining
            });
        }

        console.log(`[FlightService] After deduplication: ${flights.length} unique flights`);
        return flights;

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
};