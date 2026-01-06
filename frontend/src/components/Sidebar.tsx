import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Search } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { POPULAR_AIRLINES, COUNTRIES } from '../constants';

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
  <label className="flex items-start gap-3 cursor-pointer py-1.5 group select-none hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md px-1 -mx-1 transition-colors">
    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors mt-0.5 ${checked ? 'bg-brand-blue border-brand-blue' : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 group-hover:border-brand-blue'}`}>
      {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
    <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="flex-1">
        <div className="text-[14px] text-gray-700 dark:text-gray-300 font-medium leading-tight flex items-center gap-2">
            {label}
            {info && <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" title="More info" />}
        </div>
        {subLabel && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subLabel}</div>}
    </div>
  </label>
);

const SearchInput: React.FC<{ value: string, onChange: (val: string) => void, placeholder: string }> = ({ value, onChange, placeholder }) => (
    <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-100 dark:bg-slate-900 border-none rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
        />
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${active ? 'border-brand-blue text-brand-blue dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
    >
        {children}
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, availableAirlines }) => {
  const { t } = useLanguage();
  const [airlineSearch, setAirlineSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [timesTab, setTimesTab] = useState<'departure' | 'return'>('departure');
  const [daysTab, setDaysTab] = useState<'departure' | 'return'>('departure');

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

  const toggleDay = (type: 'departure' | 'return', day: number) => {
      setFilters(prev => {
          const currentDays = prev.days[type];
          const newDays = currentDays.includes(day) 
             ? currentDays.filter(d => d !== day) 
             : [...currentDays, day];
          return { ...prev, days: { ...prev.days, [type]: newDays } };
      });
  };

  const filteredAirlines = Array.from(new Set([...(availableAirlines || []), ...POPULAR_AIRLINES]))
      .filter(a => a.toLowerCase().includes(airlineSearch.toLowerCase()))
      .sort();

  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

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
                maxDuration: null,
                excludeCountries: [],
                days: { departure: [], return: [] },
                travelHacks: { ...prev.travelHacks, selfTransfer: true, throwawayTicketing: true, hiddenCities: true }
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
          <div className="flex border-b border-gray-100 dark:border-slate-700 mb-4">
              <TabButton active={timesTab === 'departure'} onClick={() => setTimesTab('departure')}>Departure</TabButton>
              <TabButton active={timesTab === 'return'} onClick={() => setTimesTab('return')}>Return</TabButton>
          </div>

          <div className="px-2 pb-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                 Departure 
             </div>
             <div className="text-xs text-gray-500 mb-2 flex justify-between">
                 <span>{Math.floor(filters.times[timesTab].start / 60).toString().padStart(2,'0')}:{ (filters.times[timesTab].start % 60).toString().padStart(2,'0') }</span>
                 <span>23:59</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="1439" 
               step="30"
               value={filters.times[timesTab].start} 
               onChange={(e) => {
                   const val = parseInt(e.target.value);
                   setFilters(prev => ({ ...prev, times: { ...prev.times, [timesTab]: { ...prev.times[timesTab], start: val } } }));
               }}
               className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue mb-6"
             />

             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                 Arrival
             </div>
             <div className="text-xs text-gray-500 mb-2 flex justify-between">
                 <span>00:00</span>
                 <span>{Math.floor(filters.times[timesTab === 'departure' ? 'arrival' : 'departure'].end / 60).toString().padStart(2,'0')}:{ (filters.times[timesTab === 'departure' ? 'arrival' : 'departure'].end % 60).toString().padStart(2,'0') }</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="1439" 
               step="30"
               value={filters.times[timesTab === 'departure' ? 'arrival' : 'departure'].end} // Note: This logic assumes 'arrival' in state maps to matching time filter
               onChange={(e) => {
                   // Simplified mapping for "Arrival" slider on "Times" tab
                   // If we are in Departure tab, we edit "arrival" time of outbound
                   // If we are in Return tab, we ideally need inbound arrival time. 
                   // Current types only have one 'arrival' time range. 
                   // For now, we will map Departure Tab -> Outbound Departure time & Outbound Arrival Time (conceptually)
                   // But our state structure is rigid. Let's start with Outbound Departure / Arrival only for now to match structure.
                   const val = parseInt(e.target.value);
                   setFilters(prev => ({ ...prev, times: { ...prev.times, arrival: { ...prev.times.arrival, end: val } } }));
               }}
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
            label="Self-transfer to different station" 
            checked={filters.connections?.selfTransfer} 
            onChange={(v) => setFilters(prev => ({ ...prev, connections: { ...prev.connections, selfTransfer: v } }))}
         />
          <CheckboxRow 
            label="Allow return from different station" 
            checked={filters.connections?.returnDiffStation} 
            onChange={(v) => setFilters(prev => ({ ...prev, connections: { ...prev.connections, returnDiffStation: v } }))}
         />
         <CheckboxRow 
            label="Allow return to different station" 
            checked={filters.connections?.returnToDiffStation} 
            onChange={(v) => setFilters(prev => ({ ...prev, connections: { ...prev.connections, returnToDiffStation: v } }))}
         />
      </AccordionItem>

      <AccordionItem title="Carriers">
          <SearchInput value={airlineSearch} onChange={setAirlineSearch} placeholder="Search carriers" />
          
          <div className="flex justify-between mb-2 text-xs">
              <button onClick={() => setFilters(prev => ({ ...prev, carriers: filteredAirlines }))} className="text-brand-blue hover:underline">Select all</button>
              <button onClick={() => setFilters(prev => ({ ...prev, carriers: [] }))} className="text-gray-500 hover:underline">Deselect all</button>
          </div>

        <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {filteredAirlines.map(airline => (
                <CheckboxRow
                    key={airline}
                    label={airline}
                    checked={filters.carriers.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                />
            ))}
        </div>
      </AccordionItem>

      <AccordionItem title="Travel hacks">
         <CheckboxRow 
            label="Self-transfer" 
            checked={filters.travelHacks?.selfTransfer} 
            onChange={(v) => setFilters(prev => ({ ...prev, travelHacks: { ...prev.travelHacks, selfTransfer: v } }))}
            info
         />
         <CheckboxRow 
            label="Throwaway ticketing" 
            checked={filters.travelHacks?.throwawayTicketing} 
            onChange={(v) => setFilters(prev => ({ ...prev, travelHacks: { ...prev.travelHacks, throwawayTicketing: v } }))}
            info
         />
         <CheckboxRow 
            label="Hidden cities" 
            checked={filters.travelHacks?.hiddenCities} 
            onChange={(v) => setFilters(prev => ({ ...prev, travelHacks: { ...prev.travelHacks, hiddenCities: v } }))}
            info
         />
      </AccordionItem>
      
      <AccordionItem title="Exclude countries">
          <SearchInput value={countrySearch} onChange={setCountrySearch} placeholder="Search countries" />
          <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
             {filteredCountries.map(country => (
                 <CheckboxRow
                    key={country}
                    label={country}
                    checked={filters.excludeCountries.includes(country)}
                    onChange={(checked) => setFilters(prev => ({
                        ...prev, 
                        excludeCountries: checked 
                           ? [...prev.excludeCountries, country]
                           : prev.excludeCountries.filter(c => c !== country)
                    }))}
                 />
             ))}
          </div>
      </AccordionItem>

      <AccordionItem title="Stopover">
          <div className="px-2 py-4">
             <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                 Duration: {Math.floor(filters.stopoverDuration.start / 60)}h - {Math.floor(filters.stopoverDuration.end / 60)}h
             </div>
             <div className="flex gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="48" 
                  value={filters.stopoverDuration.start / 60} 
                  onChange={(e) => setFilters(prev => ({ ...prev, stopoverDuration: { ...prev.stopoverDuration, start: parseInt(e.target.value) * 60 } }))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
             </div>
          </div>
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

      <AccordionItem title="Days">
        <div className="flex border-b border-gray-100 dark:border-slate-700 mb-4">
            <TabButton active={daysTab === 'departure'} onClick={() => setDaysTab('departure')}>Departure</TabButton>
            <TabButton active={daysTab === 'return'} onClick={() => setDaysTab('return')}>Return</TabButton>
        </div>
        <div className="flex justify-between px-2 pt-2 pb-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const dayIndex = idx; // 0=Mon, 6=Sun
                const isSelected = filters.days[daysTab].includes(dayIndex);
                return (
                    <button
                        key={idx}
                        onClick={() => toggleDay(daysTab, dayIndex)}
                        className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                            isSelected 
                            ? 'bg-brand-blue text-white shadow-md scale-110' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                    >
                        {day}
                    </button>
                );
            })}
        </div>
        <div className="text-xs text-center text-gray-400 mt-2">Select days to fly</div>
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
    </div>
  );
};
