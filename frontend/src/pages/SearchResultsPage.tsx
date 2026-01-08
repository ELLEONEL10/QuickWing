import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchBar, CITY_CODES } from '../components/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { FlightList } from '../components/FlightList';
import { Flight, FilterState } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { searchFlights } from '../services/flightService';

const reverseCityCode = (code: string) => {
    const entry = Object.entries(CITY_CODES).find(([key, value]) => value === code);
    return entry ? entry[0] : code;
};

export const SearchResultsPage: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Initial complex state for filters
    const [filters, setFilters] = useState<FilterState>({
        priceAlerts: false,
        bags: { cabin: 0, checked: 0 },
        stops: { any: true, direct: false, upTo1: false, upTo2: false, allowOvernight: true },
        connections: { selfTransfer: true, returnDiffStation: true, returnToDiffStation: true },
        carriers: [],
        travelHacks: { selfTransfer: true, throwawayTicketing: true, hiddenCities: true },
        excludeCountries: [],
        times: {
            departure: { start: 0, end: 1440 },
            arrival: { start: 0, end: 1440 }
        },
        maxDuration: null,
        stopoverDuration: { start: 120, end: 1500 },
        maxPrice: 3000,
        days: { departure: [], return: [] }
    });

    // Parse URL params
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const initialValues = useMemo(() => {
        return {
            from: reverseCityCode(searchParams.get('source') || ''),
            to: reverseCityCode(searchParams.get('destination') || ''),
            passengers: parseInt(searchParams.get('adults') || '1'),
            flightClass: (searchParams.get('cabin_class') || 'economy').toLowerCase(),
            departureDate: searchParams.get('outbound_department_date_start') || '',
            returnDate: searchParams.get('inbound_departure_date_start') || ''
        };
    }, [searchParams]);

    // Extract unique airlines from search results
    const availableAirlines = React.useMemo(() => {
        const airlines = new Set<string>();
        flights.forEach(f => {
            if (f.outbound.carrier) airlines.add(f.outbound.carrier);
            if (f.inbound?.carrier) airlines.add(f.inbound.carrier);
        });
        return Array.from(airlines).sort();
    }, [flights]);

    const performSearch = useCallback(async () => {
        const from = searchParams.get('source');
        const to = searchParams.get('destination');
        if (!from || !to) return;

        setIsLoading(true);
        try {
            const passengers = parseInt(searchParams.get('adults') || '1');
            const flightClass = searchParams.get('cabin_class') || 'economy';
            const departureDate = searchParams.get('outbound_department_date_start');
            const returnDate = searchParams.get('inbound_departure_date_start');

            const results = await searchFlights(
                from, 
                to, 
                passengers, 
                flightClass, 
                departureDate || undefined, 
                returnDate || undefined, 
                filters
            );
            setFlights(results);
        } catch (error) {
            console.error("Search failed", error);
            setFlights([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, filters]); // Re-run when params or filters change

    useEffect(() => {
        performSearch();
    }, [performSearch]);

    const handleSearchUpdate = (from: string, to: string, passengers: number, flightClass: string, departureDate: string, returnDate: string) => {
        const params = new URLSearchParams();
        
        params.set('source', from);
        params.set('destination', to);
        params.set('adults', passengers.toString());
        params.set('cabin_class', flightClass);
        if (departureDate) {
            params.set('outbound_department_date_start', departureDate);
            params.set('outbound_department_date_end', departureDate);
        }
        if (returnDate) {
            params.set('inbound_departure_date_start', returnDate);
            params.set('inbound_departure_date_end', returnDate);
        }
        navigate(`/flights?${params.toString()}`);
    };

    // Helper to parse time string (HH:MM) to minutes from midnight
    const parseTimeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };

    // Helper to get day of week (0=Monday, 6=Sunday) from ISO date string or departure time
    const getDayOfWeek = (dateStr?: string, departureTime?: string): number => {
        // Try to extract date from various formats
        if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                // JavaScript getDay() returns 0=Sunday, but we want 0=Monday
                return (date.getDay() + 6) % 7;
            }
        }
        return -1; // Unknown day
    };

    // Client-side filtering for all sidebar filter options
    const filteredFlights = flights.filter(flight => {
        // 1. Price filter
        if (flight.price > filters.maxPrice) return false;
        
        // 2. Stops filter - check if any stop option is selected
        const hasStopFilter = filters.stops.direct || filters.stops.upTo1 || filters.stops.upTo2;
        if (hasStopFilter) {
            const outboundStops = flight.outbound?.stops || 0;
            const inboundStops = flight.inbound?.stops || 0;
            const maxStops = Math.max(outboundStops, inboundStops);
            
            let passesStopFilter = false;
            if (filters.stops.direct && maxStops === 0) passesStopFilter = true;
            if (filters.stops.upTo1 && maxStops <= 1) passesStopFilter = true;
            if (filters.stops.upTo2 && maxStops <= 2) passesStopFilter = true;
            
            if (!passesStopFilter) return false;
        }

        // 3. Carrier/Airline filter
        if (filters.carriers.length > 0) {
            const outboundCarrier = flight.outbound?.carrier || '';
            const outboundCode = flight.outbound?.carrierCode || '';
            const inboundCarrier = flight.inbound?.carrier || '';
            const inboundCode = flight.inbound?.carrierCode || '';
            
            const matchesCarrier = filters.carriers.some(c => 
                outboundCarrier.toLowerCase().includes(c.toLowerCase()) ||
                outboundCode.toLowerCase() === c.toLowerCase() ||
                inboundCarrier.toLowerCase().includes(c.toLowerCase()) ||
                inboundCode.toLowerCase() === c.toLowerCase()
            );
            
            if (!matchesCarrier) return false;
        }

        // 4. Max duration filter (in minutes)
        if (filters.maxDuration) {
            const outboundDuration = flight.outbound?.durationMinutes || 0;
            const inboundDuration = flight.inbound?.durationMinutes || 0;
            if (outboundDuration > filters.maxDuration) return false;
            if (flight.inbound && inboundDuration > filters.maxDuration) return false;
        }

        // 5. Departure time filter
        if (filters.times?.departure) {
            const depMinutes = parseTimeToMinutes(flight.outbound?.departureTime);
            if (depMinutes < filters.times.departure.start || depMinutes > filters.times.departure.end) {
                return false;
            }
        }

        // 6. Arrival time filter
        if (filters.times?.arrival) {
            const arrMinutes = parseTimeToMinutes(flight.outbound?.arrivalTime);
            if (arrMinutes < filters.times.arrival.start || arrMinutes > filters.times.arrival.end) {
                return false;
            }
        }

        // 7. Bags filter - check if baggage requirements are met
        if (filters.bags?.cabin > 0) {
            const cabinIncluded = flight.baggageInfo?.cabinBagIncluded || 0;
            if (cabinIncluded < filters.bags.cabin) return false;
        }
        if (filters.bags?.checked > 0) {
            const checkedIncluded = flight.baggageInfo?.checkedBagIncluded || 0;
            if (checkedIncluded < filters.bags.checked) return false;
        }

        // 8. Self-transfer filter
        if (!filters.connections?.selfTransfer && flight.isSelfTransfer) {
            return false;
        }

        // 9. Stopover duration filter
        if (filters.stopoverDuration) {
            const minStopover = filters.stopoverDuration.start;
            const maxStopover = filters.stopoverDuration.end;
            
            // Check outbound layovers
            const outboundLayovers = flight.outbound?.layovers || [];
            for (const layover of outboundLayovers) {
                if (layover.durationMinutes) {
                    if (layover.durationMinutes < minStopover || layover.durationMinutes > maxStopover) {
                        return false;
                    }
                }
            }
            
            // Check inbound layovers
            const inboundLayovers = flight.inbound?.layovers || [];
            for (const layover of inboundLayovers) {
                if (layover.durationMinutes) {
                    if (layover.durationMinutes < minStopover || layover.durationMinutes > maxStopover) {
                        return false;
                    }
                }
            }
        }

        // 10. Day of week filter
        if (filters.days?.departure && filters.days.departure.length > 0) {
            const depDay = getDayOfWeek(flight.outbound?.departureDate);
            if (depDay >= 0 && !filters.days.departure.includes(depDay)) {
                return false;
            }
        }
        
        if (flight.inbound && filters.days?.return && filters.days.return.length > 0) {
            const retDay = getDayOfWeek(flight.inbound?.departureDate);
            if (retDay >= 0 && !filters.days.return.includes(retDay)) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <div className="mb-8 relative z-20">
                <SearchBar 
                    onSearch={handleSearchUpdate} 
                    isLoading={isLoading} 
                    initialValues={initialValues}
                />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button className={`w-full border py-3 rounded-xl font-bold shadow-sm transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-200' : 'bg-white border-gray-200 text-brand-blue'}`}>
                        Filters & Sort
                    </button>
                </div>

                {/* Left Sidebar */}
                <aside className="hidden lg:block w-1/4 min-w-[280px]">
                    <div className="sticky top-24">
                        <Sidebar filters={filters} setFilters={setFilters} availableAirlines={availableAirlines} />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <FlightList flights={filteredFlights} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};
