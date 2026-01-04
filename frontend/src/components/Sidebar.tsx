import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
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

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  const updateStops = (key: keyof typeof filters.stops, value: boolean) => {
      setFilters(prev => ({ ...prev, stops: { ...prev.stops, [key]: value } }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('filters')}</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Reset all</button>
      </div>

      <AccordionItem title={t('stops')}>
         <CheckboxRow 
            label={t('direct')} 
            checked={filters.stops.direct} 
            onChange={(v) => updateStops('direct', v)} 
            subLabel="from $442"
         />
         <CheckboxRow 
            label={t('oneStop')} 
            checked={filters.stops.upTo1} 
            onChange={(v) => updateStops('upTo1', v)} 
            subLabel="from $520"
         />
         <CheckboxRow 
            label={t('twoPlusStops')} 
            checked={filters.stops.upTo2} 
            onChange={(v) => updateStops('upTo2', v)} 
            subLabel="from $600"
         />
      </AccordionItem>

      <AccordionItem title={t('price')}>
          <div className="px-2 py-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Up to {t('currency')}{filters.maxPrice}</div>
             <input 
               type="range" 
               min="100" 
               max="5000" 
               value={filters.maxPrice} 
               onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
             />
          </div>
      </AccordionItem>
    </div>
  );
};
