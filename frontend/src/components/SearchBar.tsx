import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Minus, Plus } from 'lucide-react';

interface SearchBarProps {
  onSearch: (from: string, to: string, passengers: number, flightClass: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [from, setFrom] = useState('Berlin');
  const [to, setTo] = useState('New York');
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('economy');
  const [showPassengers, setShowPassengers] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to, passengers, flightClass);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all duration-300">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-300">
           <div className="flex items-center gap-6 bg-gray-100 dark:bg-slate-700/50 p-1 rounded-lg">
             <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-slate-600 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm has-[:checked]:text-brand-blue dark:has-[:checked]:text-blue-400">
                <input type="radio" name="tripType" defaultChecked className="hidden" /> 
                {t('return')}
             </label>
             <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-slate-600 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm has-[:checked]:text-brand-blue dark:has-[:checked]:text-blue-400">
                <input type="radio" name="tripType" className="hidden" /> 
                One-way
             </label>
           </div>
           
           <div className="flex items-center gap-4 ml-auto md:ml-0 relative z-20">
              {/* Class Dropdown */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => { setShowClass(!showClass); setShowPassengers(false); }}
                  className="flex items-center gap-1 hover:text-brand-blue dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {t(flightClass as any)} <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
                
                {showClass && (
                  <div className="absolute top-full right-0 md:left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                  className="flex items-center gap-1 hover:text-brand-blue dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {passengers} {t('passengers')} <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                {showPassengers && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-200 cursor-default">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Adults</span>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-bold text-gray-900 dark:text-white">{passengers}</span>
                        <button 
                          type="button"
                          onClick={() => setPassengers(Math.min(9, passengers + 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                      Maximum 9 passengers
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
          {/* Location Inputs */}
          <div className="flex flex-1 items-center bg-gray-50 dark:bg-slate-900 rounded-xl p-1 relative border border-gray-200 dark:border-slate-700 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all shadow-inner">
            <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 dark:border-slate-700">
               <div className="mr-3">
                   <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('from')}</div>
                   <input 
                     type="text" 
                     value={from}
                     onChange={(e) => setFrom(e.target.value)}
                     className="bg-transparent border-none outline-none w-full font-semibold text-gray-900 dark:text-white placeholder-gray-400"
                     placeholder="Origin"
                   />
               </div>
            </div>
            <button type="button" className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-slate-600 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform text-brand-blue dark:text-blue-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
            </button>
            <div className="flex-1 flex items-center px-4 py-3 pl-8">
               <div className="w-full">
                   <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('to')}</div>
                   <input 
                     type="text" 
                     value={to}
                     onChange={(e) => setTo(e.target.value)}
                     className="bg-transparent border-none outline-none w-full font-semibold text-gray-900 dark:text-white placeholder-gray-400"
                     placeholder="Destination"
                   />
               </div>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="flex-[0.8] flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl p-1 border border-gray-200 dark:border-slate-700 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all shadow-inner">
             <div className="flex-1 px-4 py-3 border-r border-gray-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('departure')}</div>
                <div className="font-semibold text-gray-900 dark:text-white">Fri 22/12</div>
             </div>
             <div className="flex-1 px-4 py-3">
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{t('return')}</div>
                <div className="font-semibold text-gray-900 dark:text-white">Sun 24/12</div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-brand-blue/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <span>{t('searchButton')}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
