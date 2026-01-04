import React, { useState, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { FlightList } from '../components/FlightList';
import { Flight, FilterState } from '../types';
import { MOCK_FLIGHTS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

export const HomePage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(MOCK_FLIGHTS);
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

  // Handle Search Request
  const handleSearch = useCallback(async (from: string, to: string, passengers: number, flightClass: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Simple mock filtering based on search
      const results = MOCK_FLIGHTS.filter(f => 
        (from === '' || f.outbound.origin.toLowerCase().includes(from.toLowerCase())) &&
        (to === '' || f.outbound.destination.toLowerCase().includes(to.toLowerCase()))
      );
      setFlights(results.length > 0 ? results : MOCK_FLIGHTS);
      setIsLoading(false);
    }, 1500);
  }, []);

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
      if (!isIncluded) return false;
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
                    <Sidebar filters={filters} setFilters={setFilters} />
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
