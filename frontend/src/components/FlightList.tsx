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

  const TabButton = ({ id, label, price, duration }: { id: SortOption, label: string, price: string, duration: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-4 text-left border-b-4 transition-all relative group ${
        activeTab === id 
          ? 'border-brand-blue bg-white dark:bg-slate-800' 
          : 'border-transparent bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className={`font-bold text-[15px] ${activeTab === id ? 'text-brand-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </div>
      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
        {price} • {duration}
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
            price="442 $" 
            duration="15h 20m" 
        />
        <TabButton 
            id={SortOption.CHEAPEST} 
            label={t('cheapest')} 
            price="442 $" 
            duration="18h 10m" 
        />
        <TabButton 
            id={SortOption.FASTEST} 
            label={t('fastest')} 
            price="600 $" 
            duration="12h 05m" 
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
