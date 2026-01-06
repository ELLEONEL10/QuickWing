import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { POPULAR_AIRLINES } from '../constants';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableAirlines: string[];
}

// --- Reusable UI Components ---

const AccordionItem: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-slate-700 py-4 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left group mb-2"
      >
        <span className="font-bold text-[15px] text-gray-800 dark:text-gray-200">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
};

const CheckboxRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  info?: boolean;
  subLabel?: string;
}> = ({ label, checked, onChange, info, subLabel }) => (
  <label className="flex items-start gap-3 cursor-pointer py-1.5 group select-none">
    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors mt-0.5 ${checked ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 group-hover:border-brand-blue'}`}>
      {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
    <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="flex-1">
        <div className="text-[14px] text-gray-700 dark:text-gray-300 font-medium leading-tight flex items-center gap-2">
            {label}
            {info && <Info className="w-3.5 h-3.5 text-gray-400" />}
        </div>
        {subLabel && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subLabel}</div>}
    </div>
  </label>
);

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, availableAirlines }) => {
  const { t } = useLanguage();

  const updateStops = (key: keyof typeof filters.stops, value: boolean) => {
      setFilters(prev => ({ ...prev, stops: { ...prev.stops, [key]: value } }));
  };

  const toggleAirline = (airline: string) => {
    setFilters(prev => {
      const newCarriers = prev.carriers.includes(airline)
        ? prev.carriers.filter(c => c !== airline)
        : [...prev.carriers, airline];
      return { ...prev, carriers: newCarriers };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('filters')}</h2>
          <button 
            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
            onClick={() => setFilters(prev => ({ 
                ...prev, 
                maxPrice: 3000, 
                carriers: [], 
                stops: { ...prev.stops, any: true, direct: false, upTo1: false, upTo2: false },
                maxDuration: null
            }))}
          >
            Reset all
          </button>
      </div>

      <AccordionItem title={t('stops')}>
         <CheckboxRow 
            label={t('direct')} 
            checked={filters.stops.direct} 
            onChange={(v) => updateStops('direct', v)} 
         />
         <CheckboxRow 
            label={t('oneStop')} 
            checked={filters.stops.upTo1} 
            onChange={(v) => updateStops('upTo1', v)} 
         />
         <CheckboxRow 
            label={t('twoPlusStops')} 
            checked={filters.stops.upTo2} 
            onChange={(v) => updateStops('upTo2', v)} 
         />
         <CheckboxRow
            label="Allow overnight stops"
            checked={filters.stops.allowOvernight}
            onChange={(v) => updateStops('allowOvernight', v)}
         />
      </AccordionItem>

      <AccordionItem title="Times">
          <div className="px-2 py-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                 Depart after: {Math.floor(filters.times?.departure?.start / 60).toString().padStart(2, '0')}:{ (filters.times?.departure?.start % 60).toString().padStart(2, '0') }
             </div>
             <input 
               type="range" 
               min="0" 
               max="1439" 
               step="30"
               value={filters.times?.departure?.start || 0} 
               onChange={(e) => setFilters(prev => ({ 
                   ...prev, 
                   times: { 
                       ...prev.times, 
                       departure: { ...prev.times.departure, start: parseInt(e.target.value) } 
                   } 
               }))}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
             />

             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 mt-4">
                 Arrive by: {Math.floor(filters.times?.arrival?.end / 60).toString().padStart(2, '0')}:{ (filters.times?.arrival?.end % 60).toString().padStart(2, '0') }
             </div>
             <input 
               type="range" 
               min="0" 
               max="1439" 
               step="30"
               value={filters.times?.arrival?.end || 1440} 
               onChange={(e) => setFilters(prev => ({ 
                   ...prev, 
                   times: { 
                       ...prev.times, 
                       arrival: { ...prev.times.arrival, end: parseInt(e.target.value) } 
                   } 
               }))}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
             />
          </div>
      </AccordionItem>

      <AccordionItem title="Bags">
         <CheckboxRow
            label="Cabin bag included"
            checked={filters.bags?.cabin > 0} 
            onChange={(v) => setFilters(prev => ({ ...prev, bags: { ...prev.bags, cabin: v ? 1 : 0 } }))} 
         />
         <CheckboxRow 
            label="Checked bag included" 
            checked={filters.bags?.checked > 0} 
            onChange={(v) => setFilters(prev => ({ ...prev, bags: { ...prev.bags, checked: v ? 1 : 0 } }))} 
         />
      </AccordionItem>

      <AccordionItem title="Connections">
         <CheckboxRow 
            label="Allow Self-transfer" 
            checked={filters.connections?.selfTransfer} 
            onChange={(v) => setFilters(prev => ({ ...prev, connections: { ...prev.connections, selfTransfer: v } }))}
            info={true}
            subLabel="Separate tickets, you might need to check in again."
         />
      </AccordionItem>

      <AccordionItem title={t('price')}>
          <div className="px-2 py-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Up to {t('currency')}{filters.maxPrice}</div>
             <input 
               type="range" 
               min="100" 
               max="5000" 
               step="50"
               value={filters.maxPrice} 
               onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
             />
          </div>
      </AccordionItem>
      
      <AccordionItem title={t('duration')}>
          <div className="px-2 py-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                 Max Duration: {filters.maxDuration ? `${Math.floor(filters.maxDuration / 60)}h ${filters.maxDuration % 60}m` : 'Any'}
             </div>
             <input 
               type="range" 
               min="60" 
               max="1800" 
               step="30"
               value={filters.maxDuration || 1800} 
               onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: parseInt(e.target.value) }))}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
             />
          </div>
      </AccordionItem>

      <AccordionItem title={t('airline')}>
        <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {/* Combine available airlines with popular ones, removing duplicates */}
            {Array.from(new Set([...(availableAirlines || []), ...POPULAR_AIRLINES])).sort().map(airline => (
                <CheckboxRow
                    key={airline}
                    label={airline}
                    checked={filters.carriers.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                />
            ))}
        </div>
      </AccordionItem>
    </div>
  );
};
