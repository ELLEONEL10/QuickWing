import React, { useState, useMemo } from 'react';
import { Flight, SortOption } from '../types';
import { FlightCard } from './FlightCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({ flights, isLoading }) => {
  const [activeTab, setActiveTab] = useState<SortOption>(SortOption.BEST);
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  // Calculate total duration for a flight (outbound + inbound if exists)
  const getTotalDuration = (flight: Flight) => {
    const outboundMins = flight.outbound?.durationMinutes || 0;
    const inboundMins = flight.inbound?.durationMinutes || 0;
    return outboundMins + inboundMins;
  };

  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate total stops for a flight
  const getTotalStops = (flight: Flight) => {
    const outboundStops = flight.outbound?.stops || 0;
    const inboundStops = flight.inbound?.stops || 0;
    return outboundStops + inboundStops;
  };

  // "Best" score: balance of price, duration, and stops (lower is better)
  const getBestScore = (flight: Flight) => {
    const priceScore = flight.price / 100; // Normalize price
    const durationScore = getTotalDuration(flight) / 60; // Hours
    const stopsScore = getTotalStops(flight) * 2; // Penalize stops heavily
    return priceScore + durationScore + stopsScore;
  };

  // Pre-calculate stats for tabs
  const tabStats = useMemo(() => {
    if (flights.length === 0) return { cheapest: null, fastest: null, best: null };
    
    const cheapest = [...flights].sort((a, b) => a.price - b.price)[0];
    const fastest = [...flights].sort((a, b) => getTotalDuration(a) - getTotalDuration(b))[0];
    const best = [...flights].sort((a, b) => getBestScore(a) - getBestScore(b))[0];
    
    return { cheapest, fastest, best };
  }, [flights]);

  const sortedFlights = [...flights].sort((a, b) => {
    switch (activeTab) {
      case SortOption.CHEAPEST:
        return a.price - b.price;
      case SortOption.FASTEST:
        return getTotalDuration(a) - getTotalDuration(b);
      case SortOption.BEST:
      default:
        return getBestScore(a) - getBestScore(b);
    }
  });

  // Add tags to indicate best/cheapest/fastest
  const taggedFlights = sortedFlights.map((flight, index) => {
    const tags: string[] = [];
    
    // Find cheapest
    if (tabStats.cheapest && flight.price === tabStats.cheapest.price) tags.push('Cheapest');
    
    // Find fastest
    if (tabStats.fastest && getTotalDuration(flight) === getTotalDuration(tabStats.fastest)) tags.push('Fastest');
    
    // Best (first in best-sorted list when sorted by best)
    if (tabStats.best && flight.id === tabStats.best.id) tags.push('Best');
    
    return { ...flight, tags };
  });

  const TabButton = ({ id, label, subLabel }: { id: SortOption, label: string, subLabel?: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-4 text-center border-b-4 transition-all relative group ${
        activeTab === id 
          ? 'border-brand-blue bg-white dark:bg-slate-800' 
          : 'border-transparent bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className={`font-bold text-[15px] ${activeTab === id ? 'text-brand-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </div>
      {subLabel && (
        <div className={`text-xs mt-0.5 ${activeTab === id ? 'text-brand-blue/70 dark:text-blue-400/70' : 'text-gray-500 dark:text-gray-400'}`}>
          {subLabel}
        </div>
      )}
    </button>
  );

  return (
    <div className="flex-1 min-w-0">
        {/* Sort Tabs */}
      <div className="flex mb-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <TabButton 
            id={SortOption.BEST} 
            label={t('best')}
            subLabel={tabStats.best ? formatPrice(tabStats.best.price) : undefined}
        />
        <TabButton 
            id={SortOption.CHEAPEST} 
            label={t('cheapest')}
            subLabel={tabStats.cheapest ? formatPrice(tabStats.cheapest.price) : undefined}
        />
        <TabButton 
            id={SortOption.FASTEST} 
            label={t('fastest')}
            subLabel={tabStats.fastest ? formatDuration(getTotalDuration(tabStats.fastest)) : undefined}
        />
      </div>

      {/* Results count */}
      {!isLoading && taggedFlights.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {taggedFlights.length} {taggedFlights.length === 1 ? 'flight' : 'flights'} found
        </div>
      )}

      {/* Flight Cards */}
      <div className="space-y-4">
        {isLoading ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
            </div>
        ) : taggedFlights.length > 0 ? (
            taggedFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
            ))
        ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">{t('noFlights')}</p>
            </div>
        )}
      </div>
    </div>
  );
};
