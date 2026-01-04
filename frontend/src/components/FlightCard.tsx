import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flight, Leg } from '../types';
import { Briefcase, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LegDetail: React.FC<{ leg: Leg }> = ({ leg }) => {
    const { t } = useLanguage();

    const getAirlineLogo = (carrier: string) => {
        const map: Record<string, string> = {
            'United Airlines': 'united.com',
            'Lufthansa': 'lufthansa.com',
            'British Airways': 'britishairways.com',
            'Air France': 'airfrance.com',
            'Delta': 'delta.com',
            'American Airlines': 'aa.com',
            'Emirates': 'emirates.com',
            'Qatar Airways': 'qatarairways.com',
            'Ryanair': 'ryanair.com',
            'EasyJet': 'easyjet.com',
            'KLM': 'klm.com',
            'Turkish Airlines': 'turkishairlines.com'
        };
        const domain = map[carrier];
        return domain ? `https://logo.clearbit.com/${domain}` : null;
    };

    const logoUrl = getAirlineLogo(leg.carrier);

    return (
        <div className="flex items-center py-5">
             {/* Airline Logo */}
             <div className="w-10 mr-4 flex-shrink-0 flex flex-col items-start">
                 {logoUrl ? (
                     <img 
                        src={logoUrl} 
                        alt={leg.carrier} 
                        className="w-8 h-8 object-contain mb-1 rounded-full bg-white p-0.5 shadow-sm" 
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Show fallback
                            const fallback = (e.target as HTMLImageElement).nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                        }} 
                     />
                 ) : null}
                 
                 <div className={`w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-300 mb-1 shadow-sm ${logoUrl ? 'hidden' : ''}`}>
                    {leg.carrier.substring(0, 2).toUpperCase()}
                 </div>
             </div>

             {/* Time & Route */}
             <div className="flex-1 grid grid-cols-[auto_1fr_auto] gap-x-8 gap-y-1 items-center">
                 {/* Row 1: Times and Duration Graphic */}
                 <div className="text-[16px] font-bold text-gray-900 dark:text-white leading-none w-14">
                    {leg.departureTime}
                 </div>

                 <div className="flex items-center w-full px-2">
                     <div className="h-[1px] bg-gray-300 dark:bg-slate-600 flex-1 relative">
                        {/* Dots at ends */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-500 rounded-full"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 dark:bg-slate-500 rounded-full"></div>
                     </div>
                 </div>

                 <div className="text-[16px] font-bold text-gray-900 dark:text-white leading-none w-14 text-right">
                    {leg.arrivalTime}
                    {leg.isOvernight && <sup className="text-red-500 text-[10px] ml-0.5">+1</sup>}
                 </div>

                 {/* Row 2: Airport Codes and Duration text */}
                 <div className="text-[13px] font-bold text-gray-500 dark:text-gray-400">
                    {leg.origin}
                 </div>

                 <div className="text-center text-[12px] text-gray-500 dark:text-gray-400">
                    {leg.duration}
                    {leg.stops === 0 ? (
                        <span className="mx-1">•</span>
                    ) : (
                        <span className="mx-1 text-gray-400">•</span>
                    )}
                     <span className={leg.stops === 0 ? "text-brand-blue dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}>
                        {leg.stops === 0 ? t('direct') : `${leg.stops} ${t('stops').toLowerCase()}`}
                     </span>
                 </div>

                 <div className="text-[13px] font-bold text-gray-500 dark:text-gray-400 text-right">
                    {leg.destination}
                 </div>
             </div>
        </div>
    );
};

export const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
      <div className="p-4 flex flex-col md:flex-row gap-6">
        {/* Flight Details */}
        <div className="flex-1">
           <LegDetail leg={flight.outbound} />
           <div className="h-[1px] bg-gray-100 dark:bg-slate-700 w-full"></div>
           <LegDetail leg={flight.inbound} />
        </div>

        {/* Price & Action */}
        <div className="md:w-48 flex flex-col justify-between border-l border-gray-100 dark:border-slate-700 pl-0 md:pl-6 pt-4 md:pt-0">
           <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total price</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {flight.currency}{flight.price}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                 {flight.dealRating}
              </div>
           </div>

           <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => navigate('/booking')}
                className="w-full bg-brand-blue hover:bg-blue-800 text-white font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-2"
              >
                 {t('book')} <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                 <Briefcase className="w-3 h-3" />
                 <span>Cabin bag included</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
