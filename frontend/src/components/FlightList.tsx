import React, { useState } from 'react';
import { Flight, SortOption } from '../types';
import { FlightCard } from './FlightCard';
import { useLanguage } from '../contexts/LanguageContext';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({ flights, isLoading }) => {
  const [activeTab, setActiveTab] = useState<SortOption>(SortOption.BEST);
  const { t } = useLanguage();

  const sortedFlights = [...flights].sort((a, b) => {
    if (activeTab === SortOption.CHEAPEST) return a.price - b.price;
    if (activeTab === SortOption.FASTEST) return a.outbound.stops - b.outbound.stops; 
    return 0; // Default order (Best)
  });

  const TabButton = ({ id, label }: { id: SortOption, label: string }) => (
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
    </button>
  );

  return (
    <div className="flex-1 min-w-0">
        {/* Sort Tabs */}
      <div className="flex mb-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <TabButton 
            id={SortOption.BEST} 
            label={t('best')} 
        />
        <TabButton 
            id={SortOption.CHEAPEST} 
            label={t('cheapest')} 
        />
        <TabButton 
            id={SortOption.FASTEST} 
            label={t('fastest')} 
        />
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {isLoading ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
            </div>
        ) : sortedFlights.length > 0 ? (
            sortedFlights.map(flight => (
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
