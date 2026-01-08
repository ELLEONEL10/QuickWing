import React, { useState, useMemo } from 'react';
import { Flight, SortOption } from '../types';
import { FlightCard } from './FlightCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Plane, Filter, TrendingDown, Zap, Star, Luggage, Clock, Building2 } from 'lucide-react';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
}

const FLIGHTS_PER_PAGE = 15;

// Quick filter chip type
type QuickFilter = 'all' | 'direct' | 'withBaggage' | 'shortLayover' | 'budget' | 'premium';

export const FlightList: React.FC<FlightListProps> = ({ flights, isLoading }) => {
  const [activeTab, setActiveTab] = useState<SortOption>(SortOption.BEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
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

  // Check if flight has baggage included
  const hasBaggageIncluded = (flight: Flight) => {
    return (flight.baggageInfo?.checkedBagIncluded || 0) > 0 || (flight.baggageInfo?.cabinBagIncluded || 0) > 0;
  };

  // Check if flight has short layover (under 2 hours)
  const hasShortLayover = (flight: Flight) => {
    const outboundLayovers = flight.outbound?.layovers || [];
    const inboundLayovers = flight.inbound?.layovers || [];
    const allLayovers = [...outboundLayovers, ...inboundLayovers];
    if (allLayovers.length === 0) return true; // Direct flights count as short
    return allLayovers.every(l => (l.durationMinutes || 0) <= 120);
  };

  // Get all unique airlines with their flight counts
  const airlineData = useMemo(() => {
    const airlineMap = new Map<string, { code: string; count: number; minPrice: number }>();
    flights.forEach(f => {
      const carrier = f.outbound?.carrier;
      const code = f.outbound?.carrierCode;
      if (carrier) {
        const existing = airlineMap.get(carrier);
        if (existing) {
          existing.count++;
          existing.minPrice = Math.min(existing.minPrice, f.price);
        } else {
          airlineMap.set(carrier, { code: code || '', count: 1, minPrice: f.price });
        }
      }
    });
    return Array.from(airlineMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [flights]);

  // Calculate price thresholds once
  const priceThresholds = useMemo(() => {
    if (flights.length === 0) return { budget: 0, premium: Infinity };
    const sortedByPrice = [...flights].sort((a, b) => a.price - b.price);
    const budgetIndex = Math.floor(sortedByPrice.length * 0.3);
    const premiumIndex = Math.floor(sortedByPrice.length * 0.7);
    return {
      budget: sortedByPrice[budgetIndex]?.price || 0,
      premium: sortedByPrice[premiumIndex]?.price || Infinity
    };
  }, [flights]);

  // "Best" score: balance of price, duration, and stops (lower is better)
  const getBestScore = (flight: Flight) => {
    const priceScore = flight.price / 100;
    const durationScore = getTotalDuration(flight) / 60;
    const stopsScore = getTotalStops(flight) * 2;
    return priceScore + durationScore + stopsScore;
  };

  // Apply quick filter and airline filter
  const filteredFlights = useMemo(() => {
    let result = flights;
    
    // Apply airline filter first
    if (selectedAirline) {
      result = result.filter(f => f.outbound?.carrier === selectedAirline);
    }
    
    // Then apply quick filter
    if (quickFilter !== 'all') {
      result = result.filter(flight => {
        switch (quickFilter) {
          case 'direct':
            return getTotalStops(flight) === 0;
          case 'withBaggage':
            return hasBaggageIncluded(flight);
          case 'shortLayover':
            return hasShortLayover(flight);
          case 'budget':
            return flight.price <= priceThresholds.budget;
          case 'premium':
            return flight.price >= priceThresholds.premium;
          default:
            return true;
        }
      });
    }
    
    return result;
  }, [flights, quickFilter, selectedAirline, priceThresholds]);

  // Pre-calculate stats for tabs
  const tabStats = useMemo(() => {
    if (filteredFlights.length === 0) return { cheapest: null, fastest: null, best: null };
    
    const cheapest = [...filteredFlights].sort((a, b) => a.price - b.price)[0];
    const fastest = [...filteredFlights].sort((a, b) => getTotalDuration(a) - getTotalDuration(b))[0];
    const best = [...filteredFlights].sort((a, b) => getBestScore(a) - getBestScore(b))[0];
    
    return { cheapest, fastest, best };
  }, [filteredFlights]);

  const sortedFlights = useMemo(() => {
    return [...filteredFlights].sort((a, b) => {
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
  }, [filteredFlights, activeTab]);

  // Add tags to flights
  const taggedFlights = useMemo(() => {
    return sortedFlights.map((flight) => {
      const tags: string[] = [];
      if (tabStats.cheapest && flight.price === tabStats.cheapest.price) tags.push('Cheapest');
      if (tabStats.fastest && getTotalDuration(flight) === getTotalDuration(tabStats.fastest)) tags.push('Fastest');
      if (tabStats.best && flight.id === tabStats.best.id) tags.push('Best');
      if (getTotalStops(flight) === 0) tags.push('Direct');
      if (hasBaggageIncluded(flight)) tags.push('Bags Included');
      return { ...flight, tags };
    });
  }, [sortedFlights, tabStats]);

  // Pagination
  const totalPages = Math.ceil(taggedFlights.length / FLIGHTS_PER_PAGE);
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * FLIGHTS_PER_PAGE;
    return taggedFlights.slice(startIndex, startIndex + FLIGHTS_PER_PAGE);
  }, [taggedFlights, currentPage]);

  // Reset page when filter/sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, quickFilter, selectedAirline, flights]);

  // Count flights matching each filter (from base flights, not filtered)
  const filterCounts = useMemo(() => {
    const base = selectedAirline ? flights.filter(f => f.outbound?.carrier === selectedAirline) : flights;
    return {
      all: base.length,
      direct: base.filter(f => getTotalStops(f) === 0).length,
      withBaggage: base.filter(f => hasBaggageIncluded(f)).length,
      shortLayover: base.filter(f => hasShortLayover(f)).length,
      budget: base.filter(f => f.price <= priceThresholds.budget).length,
      premium: base.filter(f => f.price >= priceThresholds.premium).length,
    };
  }, [flights, selectedAirline, priceThresholds]);

  const TabButton = ({ id, label, subLabel, icon: Icon }: { id: SortOption, label: string, subLabel?: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-4 px-4 text-center border-b-4 transition-all relative group ${
        activeTab === id 
          ? 'border-brand-blue bg-gradient-to-t from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800' 
          : 'border-transparent bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${activeTab === id ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400'}`} />
        <div className={`font-bold text-[15px] ${activeTab === id ? 'text-brand-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </div>
      </div>
      {subLabel && (
        <div className={`text-sm font-semibold ${activeTab === id ? 'text-brand-blue dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {subLabel}
        </div>
      )}
    </button>
  );

  const QuickFilterChip = ({ id, label, icon: Icon, count }: { id: QuickFilter, label: string, icon: React.ElementType, count?: number }) => (
    <button
      onClick={() => setQuickFilter(id)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
        quickFilter === id
          ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/30 scale-105'
          : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 hover:border-brand-blue/50 hover:shadow-md'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
          quickFilter === id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex-1 min-w-0">
      {/* Search Summary Header */}
      {!isLoading && flights.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-brand-blue/5 via-blue-50 to-indigo-50 dark:from-brand-blue/10 dark:via-slate-800 dark:to-slate-800 rounded-2xl border border-brand-blue/10 dark:border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {flights.length} flights found
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {airlineData.length} airlines • From {formatPrice(tabStats.cheapest?.price || 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {taggedFlights.length} {quickFilter !== 'all' || selectedAirline ? 'filtered' : ''} results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sort Tabs */}
      <div className="flex mb-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <TabButton 
          id={SortOption.BEST} 
          label={t('best')}
          subLabel={tabStats.best ? formatPrice(tabStats.best.price) : undefined}
          icon={Star}
        />
        <TabButton 
          id={SortOption.CHEAPEST} 
          label={t('cheapest')}
          subLabel={tabStats.cheapest ? formatPrice(tabStats.cheapest.price) : undefined}
          icon={TrendingDown}
        />
        <TabButton 
          id={SortOption.FASTEST} 
          label={t('fastest')}
          subLabel={tabStats.fastest ? formatDuration(getTotalDuration(tabStats.fastest)) : undefined}
          icon={Zap}
        />
      </div>

      {/* Quick Filter Chips */}
      {!isLoading && flights.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Quick Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickFilterChip id="all" label="All Flights" icon={Plane} count={filterCounts.all} />
            <QuickFilterChip id="direct" label="Direct" icon={Zap} count={filterCounts.direct} />
            <QuickFilterChip id="withBaggage" label="Bags Included" icon={Luggage} count={filterCounts.withBaggage} />
            <QuickFilterChip id="shortLayover" label="Short Layover" icon={Clock} count={filterCounts.shortLayover} />
            <QuickFilterChip id="budget" label="Budget" icon={TrendingDown} count={filterCounts.budget} />
            <QuickFilterChip id="premium" label="Premium" icon={Star} count={filterCounts.premium} />
          </div>
        </div>
      )}

      {/* Airlines Filter */}
      {!isLoading && airlineData.length > 1 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Filter by Airline</span>
            {selectedAirline && (
              <button
                onClick={() => setSelectedAirline(null)}
                className="ml-auto text-xs text-brand-blue hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {airlineData.slice(0, 8).map((airline) => (
              <button
                key={airline.name}
                onClick={() => setSelectedAirline(selectedAirline === airline.name ? null : airline.name)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedAirline === airline.name
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {airline.code && (
                  <img 
                    src={`https://images.kiwi.com/airlines/64/${airline.code}.png`}
                    alt={airline.name}
                    className="w-5 h-5 rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <span className="max-w-[120px] truncate">{airline.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedAirline === airline.name ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-600'
                }`}>
                  {airline.count}
                </span>
              </button>
            ))}
            {airlineData.length > 8 && (
              <span className="text-xs text-gray-400 self-center">+{airlineData.length - 8} more</span>
            )}
          </div>
        </div>
      )}

      {/* Results Info */}
      {!isLoading && taggedFlights.length > 0 && totalPages > 1 && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{((currentPage - 1) * FLIGHTS_PER_PAGE) + 1}-{Math.min(currentPage * FLIGHTS_PER_PAGE, taggedFlights.length)}</span> of {taggedFlights.length}
          </span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      )}

      {/* Flight Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-brand-blue/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              <Plane className="absolute inset-0 m-auto w-8 h-8 text-brand-blue animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Searching for the best deals...</p>
          </div>
        ) : paginatedFlights.length > 0 ? (
          paginatedFlights.map((flight, index) => (
            <FlightCard key={`${flight.id}-${currentPage}-${index}`} flight={flight} />
          ))
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Plane className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {quickFilter !== 'all' || selectedAirline ? 'No flights match your filters' : t('noFlights')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {quickFilter !== 'all' || selectedAirline 
                ? 'Try adjusting your filters or selecting a different airline' 
                : 'Try different dates or destinations'}
            </p>
            {(quickFilter !== 'all' || selectedAirline) && (
              <button
                onClick={() => { setQuickFilter('all'); setSelectedAirline(null); }}
                className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded-lg font-medium transition-all bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Results summary at bottom */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {((currentPage - 1) * FLIGHTS_PER_PAGE) + 1}-{Math.min(currentPage * FLIGHTS_PER_PAGE, taggedFlights.length)} of {taggedFlights.length} flights
        </div>
      )}
    </div>
  );
};
