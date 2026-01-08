import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flight, Leg } from '../types';
import { Briefcase, ChevronDown, ChevronUp, Luggage, Clock, Plane, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

const LegDetail: React.FC<{ leg: Leg; label?: string; expanded?: boolean; onToggle?: () => void }> = ({ leg, label, expanded, onToggle }) => {
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
        };
        const domain = map[carrier];
        return domain ? `https://logo.clearbit.com/${domain}` : null;
    };

    const logoUrl = getAirlineLogo(leg.carrier, leg.carrierCode);

    return (
        <div className="py-3">
            {/* Label for Outbound/Return */}
            {label && (
                <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {label}
                </div>
            )}
            
            <div className="flex items-center">
                {/* Airline Logo */}
                <div className="w-12 mr-4 flex-shrink-0 flex flex-col items-center">
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt={leg.carrier} 
                            className="w-10 h-10 object-contain rounded-lg bg-white dark:bg-slate-700 p-1 shadow-sm border border-gray-100 dark:border-slate-600" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                            }} 
                        />
                    ) : null}
                    <div className={`w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-600 dark:text-gray-300 shadow-sm ${logoUrl ? 'hidden' : ''}`}>
                        {leg.carrierCode || leg.carrier.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-center leading-tight">
                        {leg.carrierCode}
                    </span>
                </div>

                {/* Time & Route */}
                <div className="flex-1 grid grid-cols-[auto_1fr_auto] gap-x-6 gap-y-1 items-center">
                    {/* Row 1: Times and Duration Graphic */}
                    <div className="text-[18px] font-bold text-gray-900 dark:text-white leading-none">
                        {leg.departureTime}
                    </div>

                    <div className="flex items-center w-full px-2 relative">
                        <div className="h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 flex-1 relative">
                            {/* Origin dot */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-800 border-2 border-brand-blue rounded-full"></div>
                            {/* Stop dots */}
                            {leg.stops > 0 && leg.stopAirports?.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full border border-white dark:border-slate-800"
                                    style={{ left: `${((idx + 1) / (leg.stops + 1)) * 100}%` }}
                                    title={leg.stopAirports?.[idx]}
                                />
                            ))}
                            {/* Destination dot */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-brand-blue rounded-full"></div>
                        </div>
                    </div>

                    <div className="text-[18px] font-bold text-gray-900 dark:text-white leading-none text-right">
                        {leg.arrivalTime}
                        {leg.isOvernight && <sup className="text-red-500 text-[10px] ml-0.5 font-medium">+1</sup>}
                    </div>

                    {/* Row 2: Airport Codes and Duration text */}
                    <div className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                        {leg.originCode || leg.origin}
                    </div>

                    <div className="text-center text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{leg.duration}</span>
                        <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
                        <span className={`font-semibold ${leg.stops === 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {leg.stops === 0 ? t('direct') : `${leg.stops} ${leg.stops === 1 ? 'stop' : 'stops'}`}
                        </span>
                    </div>

                    <div className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 text-right">
                        {leg.destinationCode || leg.destination}
                    </div>
                </div>

                {/* Expand button for stops */}
                {leg.stops > 0 && onToggle && (
                    <button 
                        onClick={onToggle}
                        className="ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                )}
            </div>

            {/* Expanded layover details */}
            {expanded && leg.stops > 0 && leg.layovers && leg.layovers.length > 0 && (
                <div className="mt-3 ml-16 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {leg.segments?.map((segment, idx) => (
                        <div key={idx}>
                            {/* Flight segment */}
                            <div className="flex items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                                <Plane className="w-3.5 h-3.5 text-brand-blue" />
                                <span className="font-semibold">{segment.flightNumber}</span>
                                <span>{segment.origin} → {segment.destination}</span>
                                <span className="ml-auto text-gray-500">{segment.duration}</span>
                            </div>
                            
                            {/* Layover after this segment (if not last) */}
                            {idx < leg.layovers!.length && leg.layovers![idx] && (
                                <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 py-2 pl-3 border-l-2 border-dashed border-amber-300 dark:border-amber-600 ml-2 my-1">
                                    <Clock className="w-3 h-3" />
                                    <span className="font-medium">
                                        {leg.layovers![idx].duration} layover in {leg.layovers![idx].airport} ({leg.layovers![idx].airportCode})
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stop airports summary (when not expanded) */}
            {!expanded && leg.stops > 0 && leg.stopAirports && leg.stopAirports.length > 0 && (
                <div className="mt-1 ml-16 text-[10px] text-gray-400 dark:text-gray-500">
                    via {leg.stopAirports.join(', ')}
                </div>
            )}
        </div>
    );
};

export const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const navigate = useNavigate();
  const [outboundExpanded, setOutboundExpanded] = useState(false);
  const [inboundExpanded, setInboundExpanded] = useState(false);
  
  const handleBook = () => {
      navigate('/flight-details', { state: { flight } });
  };

  // Check if any leg is self-transfer or virtual interlining
  const hasSelfTransfer = flight.isSelfTransfer || false;
  const hasVirtualInterlining = flight.isVirtualInterlining || false;

  // Currency symbol mapping
  const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', INR: '₹'
  };
  const currencySymbol = currencySymbols[currency] || '$';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl mb-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 overflow-hidden group">
      {/* Connection Warning Banner */}
      {(hasSelfTransfer || hasVirtualInterlining) && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  {hasSelfTransfer && 'Self-transfer required - You must collect and re-check your baggage'}
                  {hasVirtualInterlining && !hasSelfTransfer && 'Virtual interlining - Separate tickets, bags not transferred'}
              </span>
          </div>
      )}
      
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Legs Section */}
          <div className="flex-1 min-w-0">
              {/* Outbound */}
              <LegDetail 
                  leg={flight.outbound} 
                  label={flight.inbound ? "Outbound" : undefined}
                  expanded={outboundExpanded}
                  onToggle={flight.outbound.stops > 0 ? () => setOutboundExpanded(!outboundExpanded) : undefined}
              />
              
              {/* Divider if inbound */}
              {flight.inbound && (
                  <div className="my-2 border-t border-dashed border-gray-200 dark:border-slate-600"></div>
              )}

              {/* Inbound */}
              {flight.inbound && (
                  <LegDetail 
                      leg={flight.inbound} 
                      label="Return"
                      expanded={inboundExpanded}
                      onToggle={flight.inbound.stops > 0 ? () => setInboundExpanded(!inboundExpanded) : undefined}
                  />
              )}
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-slate-600 to-transparent"></div>

          {/* Price & Action Section */}
          <div className="w-full lg:w-52 flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-700">
              <div className="flex-1 lg:text-center">
                   {/* Baggage Info */}
                   {flight.baggageInfo && (
                       <div className="flex lg:justify-center items-center gap-3 mb-3 text-[11px]">
                           <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400" title="Personal item">
                               <Briefcase className="w-3.5 h-3.5" />
                               <span>1</span>
                           </div>
                           {(flight.baggageInfo.cabinBagIncluded || 0) > 0 ? (
                               <div className="flex items-center gap-1 text-green-600 dark:text-green-400" title="Cabin bag included">
                                   <Luggage className="w-3.5 h-3.5" />
                                   <span>✓</span>
                               </div>
                           ) : (
                               <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500" title="No cabin bag">
                                   <Luggage className="w-3.5 h-3.5" />
                                   <span>-</span>
                               </div>
                           )}
                           {(flight.baggageInfo.checkedBagIncluded || 0) > 0 ? (
                               <div className="flex items-center gap-1 text-green-600 dark:text-green-400" title="Checked bag included">
                                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                       <rect x="6" y="3" width="12" height="18" rx="2" />
                                       <path d="M9 3v18M15 3v18M6 12h12" />
                                   </svg>
                                   <span>✓</span>
                               </div>
                           ) : flight.baggageInfo.checkedBagPrice ? (
                               <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`Checked bag from ${currencySymbol}${flight.baggageInfo.checkedBagPrice}`}>
                                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                       <rect x="6" y="3" width="12" height="18" rx="2" />
                                       <path d="M9 3v18M15 3v18M6 12h12" />
                                   </svg>
                                   <span className="text-[10px]">+{currencySymbol}{Math.round(flight.baggageInfo.checkedBagPrice)}</span>
                               </div>
                           ) : null}
                       </div>
                   )}
                   
                   <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mb-1">
                       {flight.inbound ? 'Round-trip' : 'One-way'} • per person
                   </div>
                   <div className="text-2xl lg:text-3xl font-extrabold text-brand-blue dark:text-blue-400">
                      {formatPrice(flight.price)}
                   </div>
              </div>

              <button 
                  onClick={handleBook}
                  className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-dark hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-blue/20 transition-all active:scale-95 w-auto lg:w-full flex items-center justify-center gap-2 group-hover:shadow-brand-blue/40"
              >
                  {t('book')} <Briefcase className="w-4 h-4" />
              </button>
          </div>

        </div>
        
        {/* Footer Tags */}
        {flight.tags && flight.tags.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex flex-wrap gap-2">
               {flight.tags.map((tag, i) => {
                   // Different colors for different tag types
                   let tagClass = "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300";
                   let icon = '';
                   
                   if (tag === 'Cheapest') {
                       tagClass = "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800";
                       icon = '💰 ';
                   } else if (tag === 'Fastest') {
                       tagClass = "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
                       icon = '⚡ ';
                   } else if (tag === 'Best') {
                       tagClass = "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
                       icon = '⭐ ';
                   } else if (tag === 'Direct') {
                       tagClass = "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
                       icon = '✈️ ';
                   } else if (tag === 'Bags Included') {
                       tagClass = "bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800";
                       icon = '🧳 ';
                   }
                   
                   return (
                       <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${tagClass}`}>
                           {icon}{tag}
                       </span>
                   );
               })}
            </div>
        )}
      </div>
    </div>
  );
};
