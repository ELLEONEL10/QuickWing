import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Minus, Plus, ArrowLeftRight, Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (from: string, to: string, passengers: number, flightClass: string, departureDate: string, returnDate: string) => void;
  isLoading: boolean;
  initialValues?: {
    from?: string;
    to?: string;
    passengers?: number;
    flightClass?: string;
    departureDate?: string;
    returnDate?: string;
  };
}

export const POPULAR_CITIES = [
    "London", "Paris", "New York", "Berlin", "Tokyo", "Dubai", "Singapore", 
    "Los Angeles", "Rome", "Barcelona", "Amsterdam", "Hong Kong", "Sydney",
    "Istanbul", "Bangkok", "Madrid", "Frankfurt", "Dublin", "Lisbon", "Dubrovnik"
];

export const CITY_CODES: Record<string, string> = {
    "London": "City:london_gb",
    "Paris": "City:paris_fr",
    "New York": "City:new-york-city_ny_us",
    "Berlin": "City:berlin_de",
    "Tokyo": "City:tokyo_jp",
    "Dubai": "City:dubai_ae",
    "Singapore": "City:singapore_sg",
    "Los Angeles": "City:los-angeles_ca_us",
    "Rome": "City:rome_it",
    "Barcelona": "City:barcelona_es",
    "Amsterdam": "City:amsterdam_nl",
    "Hong Kong": "City:hong-kong_hk",
    "Sydney": "City:sydney_au",
    "Istanbul": "City:istanbul_tr",
    "Bangkok": "City:bangkok_th",
    "Madrid": "City:madrid_es",
    "Frankfurt": "City:frankfurt-am-main_de",
    "Dublin": "City:dublin_ie",
    "Lisbon": "City:lisbon_pt",
    "Dubrovnik": "City:dubrovnik_hr"
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialValues }) => {
  const [from, setFrom] = useState(initialValues?.from || '');
  const [to, setTo] = useState(initialValues?.to || '');
  const [passengers, setPassengers] = useState(initialValues?.passengers || 1);
  const [flightClass, setFlightClass] = useState(initialValues?.flightClass || 'economy');
  const [showPassengers, setShowPassengers] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [isReturnTrip, setIsReturnTrip] = useState(initialValues?.returnDate ? true : true);
  
  // Date states
  const [departureDate, setDepartureDate] = useState(initialValues?.departureDate || new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  
  // Autocomplete states
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  useEffect(() => {
    if (initialValues) {
        if (initialValues.from !== undefined && initialValues.from !== from) setFrom(initialValues.from);
        if (initialValues.to !== undefined && initialValues.to !== to) setTo(initialValues.to);
        // Only update these if strictly necessary to avoid resetting user interaction
        // setPassengers(initialValues.passengers || 1);
        // setFlightClass(initialValues.flightClass || 'economy');
    }
  }, [initialValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceCode = CITY_CODES[from] || from;
    const destCode = CITY_CODES[to] || to;
    onSearch(sourceCode, destCode, passengers, flightClass, departureDate, isReturnTrip ? returnDate : '');
  };

  const handleSwap = () => {
      const temp = from;
      setFrom(to);
      setTo(temp);
  };

  const filteredFromCities = POPULAR_CITIES.filter(c => c.toLowerCase().includes(from.toLowerCase()));
  const filteredToCities = POPULAR_CITIES.filter(c => c.toLowerCase().includes(to.toLowerCase()));

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all duration-300">
      <div className="max-w-full mx-auto">
        
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-300">
           <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700/50 p-1.5 rounded-xl">
             <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm has-[:checked]:text-brand-blue dark:has-[:checked]:text-blue-400 has-[:checked]:font-bold">
                <input 
                  type="radio" 
                  name="tripType" 
                  checked={isReturnTrip}
                  onChange={() => setIsReturnTrip(true)}
                  className="hidden" 
                /> 
                {t('return')}
             </label>
             <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm has-[:checked]:text-brand-blue dark:has-[:checked]:text-blue-400 has-[:checked]:font-bold">
                <input 
                  type="radio" 
                  name="tripType" 
                  checked={!isReturnTrip}
                  onChange={() => setIsReturnTrip(false)}
                  className="hidden" 
                /> 
                One-way
             </label>
           </div>
           
           <div className="flex items-center gap-4 ml-auto md:ml-0 relative z-20">
              {/* Class Dropdown */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => { setShowClass(!showClass); setShowPassengers(false); }}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors font-semibold"
                >
                  <span className="capitalize">{t(flightClass as any)}</span> 
                  <ChevronDown className={`w-4 h-4 transition-transform ${showClass ? 'rotate-180' : ''}`} />
                </button>
                
                {showClass && (
                  <div className="absolute top-full right-0 md:left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-30">
                    {['economy', 'business', 'firstClass'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setFlightClass(c); setShowClass(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm ${flightClass === c ? 'text-brand-blue dark:text-blue-400 font-bold bg-blue-50 dark:bg-slate-700/50' : 'text-gray-700 dark:text-gray-200'}`}
                      >
                        {t(c as any)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Passengers Dropdown */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => { setShowPassengers(!showPassengers); setShowClass(false); }}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors font-semibold"
                >
                  {passengers} {t('passengers')} 
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPassengers ? 'rotate-180' : ''}`} />
                </button>

                {showPassengers && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-5 animate-in fade-in zoom-in-95 duration-200 cursor-default z-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-base">Adults</span>
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-50"
                          disabled={passengers <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg text-gray-900 dark:text-white">{passengers}</span>
                        <button 
                          type="button"
                          onClick={() => setPassengers(Math.min(9, passengers + 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-50"
                          disabled={passengers >= 9}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 text-right mt-2">
                      Age 12+
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 relative">
          
          {/* Location Inputs */}
          <div className="flex flex-col md:flex-row flex-[1.5] items-center bg-gray-50 dark:bg-slate-900 rounded-2xl p-1.5 border border-gray-200 dark:border-slate-700 shadow-inner group focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all">
            
            {/* FROM Input */}
            <div className="flex-1 w-full relative" ref={fromRef}>
               <div className="px-4 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors cursor-text" onClick={() => { setShowFromSuggestions(true); setShowToSuggestions(false); }}>
                   <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('from')}</div>
                   <input 
                     type="text" 
                     value={from}
                     onChange={(e) => { setFrom(e.target.value); setShowFromSuggestions(true); }}
                     onFocus={() => setShowFromSuggestions(true)}
                     className="bg-transparent border-none outline-none w-full font-bold text-lg text-gray-900 dark:text-white placeholder-gray-400 p-0"
                     placeholder="Origin"
                   />
               </div>
               
               {/* Suggestions Dropdown */}
               {showFromSuggestions && (
                   <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 max-h-60 overflow-y-auto z-40 animate-in fade-in zoom-in-95 duration-100">
                       {filteredFromCities.length > 0 ? (
                           filteredFromCities.map(city => (
                               <button 
                                key={city} 
                                type="button" 
                                className="w-full text-left px-4 py-3 hover:bg-brand-blue/5 dark:hover:bg-slate-700 font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                onClick={() => { setFrom(city); setShowFromSuggestions(false); }}
                               >
                                   <Search className="w-4 h-4 text-gray-400" /> {city}
                               </button>
                           ))
                       ) : (
                           <div className="p-4 text-gray-400 text-sm text-center">No cities found</div>
                       )}
                   </div>
               )}
            </div>

            {/* Swap Button */}
            <button 
                type="button" 
                onClick={handleSwap}
                className="hidden md:flex p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-gray-200 dark:border-slate-600 relative z-10 hover:scale-110 hover:rotate-180 transition-all text-brand-blue dark:text-blue-400 mx-[-12px]"
            >
                <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* TO Input */}
            <div className="flex-1 w-full relative" ref={toRef}>
               <div className="px-4 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors cursor-text" onClick={() => { setShowToSuggestions(true); setShowFromSuggestions(false); }}>
                   <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('to')}</div>
                   <input 
                     type="text" 
                     value={to}
                     onChange={(e) => { setTo(e.target.value); setShowToSuggestions(true); }}
                     onFocus={() => setShowToSuggestions(true)}
                     className="bg-transparent border-none outline-none w-full font-bold text-lg text-gray-900 dark:text-white placeholder-gray-400 p-0"
                     placeholder="Destination"
                   />
               </div>

                {/* Suggestions Dropdown */}
               {showToSuggestions && (
                   <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 max-h-60 overflow-y-auto z-40 animate-in fade-in zoom-in-95 duration-100">
                       {filteredToCities.length > 0 ? (
                           filteredToCities.map(city => (
                               <button 
                                key={city} 
                                type="button" 
                                className="w-full text-left px-4 py-3 hover:bg-brand-blue/5 dark:hover:bg-slate-700 font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                onClick={() => { setTo(city); setShowToSuggestions(false); }}
                               >
                                   <Search className="w-4 h-4 text-gray-400" /> {city}
                               </button>
                           ))
                       ) : (
                           <div className="p-4 text-gray-400 text-sm text-center">No cities found</div>
                       )}
                   </div>
               )}
            </div>

          </div>
          {/* Date Inputs */}
          <div className="flex flex-1 items-center bg-gray-50 dark:bg-slate-900 rounded-2xl p-1.5 border border-gray-200 dark:border-slate-700 shadow-inner focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all">
             <div className="flex-1 px-4 py-2 border-r border-gray-200 dark:border-slate-700 relative">
                <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('departure')}</div>
                <input 
                    type="date" 
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="bg-transparent border-none outline-none w-full font-bold text-sm text-gray-900 dark:text-white p-0 uppercase" 
                />
             </div>
             {isReturnTrip && (
                 <div className="flex-1 px-4 py-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('return')}</div>
                    <input 
                        type="date" 
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="bg-transparent border-none outline-none w-full font-bold text-sm text-gray-900 dark:text-white p-0 uppercase" 
                    />
                 </div>
             )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-brand-blue/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <span>{t('searchButton')}</span>
                    <Search className="w-5 h-5" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
