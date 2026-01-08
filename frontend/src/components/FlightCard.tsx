import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flight, Leg } from '../types';
import { Briefcase, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

const LegDetail: React.FC<{ leg: Leg }> = ({ leg }) => {
    const { t } = useLanguage();

    const getAirlineLogo = (carrier: string, carrierCode?: string) => {
        // Try using carrier code with Kiwi's CDN which is generally reliable for IATA codes
        if (carrierCode) {
            return `https://images.kiwi.com/airlines/64/${carrierCode}.png`;
        }

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
            'Turkish Airlines': 'turkishairlines.com',
            'Singapore Airlines': 'singaporeair.com',
            'Cathay Pacific': 'cathaypacific.com',
            'Etihad Airways': 'etihad.com',
            'Air Canada': 'aircanada.com',
             // Fallback for some others
        };
        const domain = map[carrier];
        return domain ? `https://logo.clearbit.com/${domain}` : null;
    };

    const logoUrl = getAirlineLogo(leg.carrier, leg.carrierCode);

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
                            // If Kiwi fails, try to fallback or hide
                            (e.target as HTMLImageElement).style.display = 'none';
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
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const handleBook = () => {
      navigate('/flight-details', { state: { flight } });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Legs Section */}
        <div className="flex-1 min-w-0 pr-0 md:pr-6 border-r-0 md:border-r border-dashed border-gray-200 dark:border-slate-700">
            {/* Outbound */}
            <LegDetail leg={flight.outbound} />
            
            {/* Divider if inbound */}
            {flight.inbound && (
                <div className="my-2 border-t border-gray-50 dark:border-slate-700/50"></div>
            )}

            {/* Inbound */}
            {flight.inbound && (
                <LegDetail leg={flight.inbound} />
            )}
        </div>

        {/* Price & Action Section */}
        <div className="w-full md:w-48 flex flex-row md:flex-col justify-between items-center md:justify-center gap-4 pl-0 md:pl-2">
            <div>
                 <div className="text-right md:text-center text-sm text-gray-400 font-medium mb-1">Total Price</div>
                 <div className="text-right md:text-center text-3xl font-extrabold text-brand-blue dark:text-blue-400">
                    {formatPrice(flight.price)}
                 </div>
                 {flight.dealRating && (
                     <div className="hidden md:block text-xs font-bold text-center mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                         {flight.dealRating}
                     </div>
                 )}
            </div>

            <button 
                onClick={handleBook}
                className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-blue/30 transition-all active:scale-95 w-auto md:w-full flex items-center justify-center gap-2"
            >
                {t('bookNow')} <Briefcase className="w-4 h-4" />
            </button>
        </div>

      </div>
      
      {/* Footer Tags */}
      {flight.tags && flight.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-2 overflow-x-auto">
             {flight.tags.map((tag, i) => (
                 <span key={i} className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md whitespace-nowrap">
                     {tag}
                 </span>
             ))}
          </div>
      )}
    </div>
  );
};
