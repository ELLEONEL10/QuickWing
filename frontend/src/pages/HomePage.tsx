import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { FlightList } from '../components/FlightList';
import { Flight, FilterState } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { searchFlights } from '../services/flightService';

export const HomePage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  
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

  const [lastSearchParams, setLastSearchParams] = useState<any>(null);

  // Extract unique airlines from search results
  const availableAirlines = React.useMemo(() => {
    const airlines = new Set<string>();
    flights.forEach(f => {
        if (f.outbound.carrier) airlines.add(f.outbound.carrier);
        if (f.inbound?.carrier) airlines.add(f.inbound.carrier);
    });
    return Array.from(airlines).sort();
  }, [flights]);

  // Handle Search Request
  const handleSearch = useCallback(async (from: string, to: string, passengers: number, flightClass: string, departureDate: string, returnDate: string) => {
    setLastSearchParams({ from, to, passengers, flightClass, departureDate, returnDate });
    setIsLoading(true);
    try {
      const results = await searchFlights(from, to, passengers, flightClass, departureDate, returnDate, filters);
      setFlights(results);
    } catch (error) {
      console.error("Search failed", error);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (lastSearchParams) {
        const timer = setTimeout(() => {
            handleSearch(
                lastSearchParams.from, 
                lastSearchParams.to, 
                lastSearchParams.passengers, 
                lastSearchParams.flightClass, 
                lastSearchParams.departureDate, 
                lastSearchParams.returnDate
            );
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [filters]);

  // Filter Logic
  const filteredFlights = flights.filter(flight => {
    if (flight.price > filters.maxPrice) return false;
    
    if (!filters.stops.any) {
        if (filters.stops.direct && flight.outbound.stops > 0) return false;
        if (filters.stops.upTo1 && flight.outbound.stops > 1) return false;
        if (filters.stops.upTo2 && flight.outbound.stops > 2) return false;
    }

    if (filters.carriers.length > 0) {
      const outboundCarrier = flight.outbound.carrier;
      const isIncluded = filters.carriers.some(c => outboundCarrier.includes(c));
      const inboundIncluded = flight.inbound ? filters.carriers.some(c => flight.inbound.carrier.includes(c)) : true;
      if (!isIncluded && !inboundIncluded) return false;
    }

    if (filters.maxDuration) {
        if (flight.outbound.durationMinutes > filters.maxDuration) return false;
        if (flight.inbound && flight.inbound.durationMinutes > filters.maxDuration) return false;
    }

    if (filters.times?.departure?.start > 0) {
        const [hours, minutes] = flight.outbound.departureTime.split(':').map(Number);
        const flightMinutes = hours * 60 + minutes;
        if (flightMinutes < filters.times.departure.start) return false;
    }

    if (filters.times?.arrival?.end < 1440) {
        const [hours, minutes] = flight.outbound.arrivalTime.split(':').map(Number);
        const flightMinutes = hours * 60 + minutes;
        if (flightMinutes > filters.times.arrival.end) return false;
    }

    // Stopover Duration Logic (Approximate check if stops > 0)
    if (filters.stopoverDuration) {
        // This would require more detailed segment data to calculate actual stopover times
        // Logic reserved for when full itinerary details are available
    }

    // Travel Days Logic
    if (filters.days.departure.length > 0) {
        // Currently we don't have the date object of the flight, only time string.
        // Assuming search results match requested date, this filter is most useful when searching flexible dates
        // Placeholder for future implementation
    }
    
    // Connections logic 
    if (filters.connections) {
         if (!filters.connections.selfTransfer && flight.tags?.includes('Self-transfer')) return false;
    }

    // Exclude Countries Logic
    if (filters.excludeCountries.length > 0) {
         if (flight.outbound.stopAirports?.some(airport => filters.excludeCountries.includes(airport))) return false; 
         // Note: airport codes would need mapping to countries for this to be fully accurate
    }

    return true;
  });

  return (
    <div className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-accent">
                Where to next?
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Find the best flights at the best prices.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 relative z-20">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
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
