import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Flight, Leg } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Briefcase, Clock, ChevronRight, ArrowRight, Luggage, Info, Plane, AlertTriangle, CheckCircle, Package } from 'lucide-react';

// Segment-by-segment flight display
const FlightSegmentTimeline: React.FC<{ leg: Leg }> = ({ leg }) => {
    const getAirlineLogo = (carrierCode?: string) => {
        if (carrierCode) {
            return `https://images.kiwi.com/airlines/64/${carrierCode}.png`;
        }
        return null;
    };

    // If no segments data, show simple view
    if (!leg.segments || leg.segments.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                        <div className="w-0.5 flex-1 min-h-[60px] bg-gradient-to-b from-brand-blue to-gray-300 dark:to-slate-600"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-slate-500"></div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{leg.departureTime}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{leg.origin} ({leg.originCode})</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{leg.arrivalTime}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{leg.destination} ({leg.destinationCode})</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{leg.duration}</div>
                        <div className="text-xs text-gray-400">{leg.carrier}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Show detailed segment-by-segment view (Berlin → Budapest, then Budapest → Tokyo)
    return (
        <div className="space-y-0">
            {leg.segments.map((segment, idx) => (
                <div key={idx}>
                    {/* Flight Segment */}
                    <div className="flex items-start gap-4 relative">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-brand-blue border-2 border-white dark:border-slate-800 shadow-sm z-10"></div>
                            <div className="w-0.5 flex-1 min-h-[80px] bg-brand-blue/30"></div>
                            <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white dark:border-slate-800 shadow-sm ${idx === leg.segments!.length - 1 ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                        </div>
                        
                        {/* Segment Details */}
                        <div className="flex-1 pb-4">
                            {/* Departure */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{segment.departureTime}</div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.origin}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{segment.originCode}</div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-1.5">
                                        {getAirlineLogo(segment.carrierCode) && (
                                            <img 
                                                src={getAirlineLogo(segment.carrierCode)!} 
                                                alt={segment.carrier}
                                                className="w-5 h-5 object-contain"
                                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                            />
                                        )}
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{segment.flightNumber}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{segment.carrier}</div>
                                </div>
                            </div>
                            
                            {/* Flight duration bar */}
                            <div className="flex items-center gap-3 mb-6 ml-2">
                                <Plane className="w-4 h-4 text-brand-blue rotate-90" />
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-blue via-brand-blue/50 to-brand-blue/20"></div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {segment.duration}
                                </span>
                            </div>
                            
                            {/* Arrival */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{segment.arrivalTime}</div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.destination}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{segment.destinationCode}</div>
                                </div>
                                {segment.cabinClass && (
                                    <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                        {segment.cabinClass}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Layover (if not last segment) */}
                    {idx < leg.segments!.length - 1 && leg.layovers && leg.layovers[idx] && (
                        <div className="flex items-start gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center z-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="w-0.5 flex-1 min-h-[20px] bg-amber-300/50 border-l-2 border-dashed border-amber-400"></div>
                            </div>
                            <div className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                            {leg.layovers[idx].duration} Layover
                                        </div>
                                        <div className="text-xs text-amber-600 dark:text-amber-400">
                                            Connection in {leg.layovers[idx].airport} ({leg.layovers[idx].airportCode})
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-800/30 px-2 py-0.5 rounded-full">
                                            Change planes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Baggage Info Card
const BaggageInfoCard: React.FC<{ flight: Flight }> = ({ flight }) => {
    const { currency } = useCurrency();
    
    const currencySymbols: Record<string, string> = {
        USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', INR: '₹'
    };
    const symbol = currencySymbols[currency] || '$';

    const baggage = flight.baggageInfo;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Luggage className="w-5 h-5 text-brand-blue" />
                Baggage Allowance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Personal Item */}
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">Personal Item</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Always included</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Max 40x30x20cm</div>
                    </div>
                </div>
                
                {/* Cabin Bag */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                    (baggage?.cabinBagIncluded || 0) > 0 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        (baggage?.cabinBagIncluded || 0) > 0 
                            ? 'bg-green-100 dark:bg-green-900/40' 
                            : 'bg-gray-100 dark:bg-slate-700'
                    }`}>
                        <Luggage className={`w-5 h-5 ${
                            (baggage?.cabinBagIncluded || 0) > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-400'
                        }`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">Cabin Bag</span>
                            {(baggage?.cabinBagIncluded || 0) > 0 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <span className="text-[10px] bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">Not included</span>
                            )}
                        </div>
                        {(baggage?.cabinBagIncluded || 0) > 0 ? (
                            <div className="text-xs text-green-600 dark:text-green-400">Included in fare</div>
                        ) : baggage?.cabinBagPrice ? (
                            <div className="text-xs text-gray-600 dark:text-gray-400">Add from {symbol}{Math.round(baggage.cabinBagPrice)}</div>
                        ) : (
                            <div className="text-xs text-gray-500">Check with airline</div>
                        )}
                        <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Max 55x40x23cm, 8kg</div>
                    </div>
                </div>
                
                {/* Checked Bag */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                    (baggage?.checkedBagIncluded || 0) > 0 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        (baggage?.checkedBagIncluded || 0) > 0 
                            ? 'bg-green-100 dark:bg-green-900/40' 
                            : 'bg-gray-100 dark:bg-slate-700'
                    }`}>
                        <Package className={`w-5 h-5 ${
                            (baggage?.checkedBagIncluded || 0) > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-400'
                        }`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">Checked Bag</span>
                            {(baggage?.checkedBagIncluded || 0) > 0 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <span className="text-[10px] bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">Not included</span>
                            )}
                        </div>
                        {(baggage?.checkedBagIncluded || 0) > 0 ? (
                            <div className="text-xs text-green-600 dark:text-green-400">{baggage?.checkedBagIncluded} bag(s) included</div>
                        ) : baggage?.checkedBagPrice ? (
                            <div className="text-xs text-gray-600 dark:text-gray-400">Add from {symbol}{Math.round(baggage.checkedBagPrice)}</div>
                        ) : (
                            <div className="text-xs text-gray-500">Check with airline</div>
                        )}
                        <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Max 23kg per bag</div>
                    </div>
                </div>
            </div>
            
            {/* Baggage note */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Baggage allowances may vary by airline and fare type. Final baggage fees will be confirmed during booking.
                    </p>
                </div>
            </div>
        </div>
    );
};

const FlightLegDetails: React.FC<{ leg: Leg; title: string; isReturn?: boolean }> = ({ leg, title, isReturn }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReturn ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-brand-blue/10 dark:bg-blue-900/30'}`}>
                        <Plane className={`w-5 h-5 ${isReturn ? 'text-purple-600 dark:text-purple-400 rotate-180' : 'text-brand-blue dark:text-blue-400'}`} />
                    </div>
                    <div>
                        <span className={`text-sm font-medium ${isReturn ? 'text-purple-600 dark:text-purple-400' : 'text-brand-blue dark:text-blue-400'}`}>
                            {isReturn ? 'Return Flight' : 'Outbound Flight'}
                        </span>
                        <div className="text-lg">{title}</div>
                    </div>
                </h3>
                <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Duration</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {leg.duration}
                    </div>
                </div>
            </div>
            
            {/* Self-transfer warning */}
            {leg.stops > 0 && (
                <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                            {leg.stops} Connection{leg.stops > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-300">
                            You'll need to change planes at {leg.stopAirports?.join(' and ')}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Segment Timeline */}
            <FlightSegmentTimeline leg={leg} />
        </div>
    );
}

export const FlightDetailsPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const flight = state?.flight as Flight;

  if (!flight) {
    return <Navigate to="/" replace />;
  }

  const handleProceed = () => {
      navigate('/booking', { state: { flight } });
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
             <span className="cursor-pointer hover:text-brand-blue transition-colors" onClick={() => navigate('/')}>Home</span>
             <ChevronRight className="w-4 h-4" />
             <span className="cursor-pointer hover:text-brand-blue transition-colors" onClick={() => navigate(-1)}>Search Results</span>
             <ChevronRight className="w-4 h-4" />
             <span className="text-brand-blue dark:text-blue-400">Flight Details</span>
        </div>

        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Review your trip</h1>
            <p className="text-gray-500 dark:text-gray-400">
                {flight.outbound.origin} → {flight.outbound.destination}
                {flight.inbound && ` → ${flight.inbound.destination}`}
            </p>
        </div>

        {/* Outbound Flight */}
        <FlightLegDetails 
            leg={flight.outbound} 
            title={`${flight.outbound.origin} → ${flight.outbound.destination}`} 
        />
        
        {/* Return Flight */}
        {flight.inbound && (
            <FlightLegDetails 
                leg={flight.inbound} 
                title={`${flight.inbound.origin} → ${flight.inbound.destination}`}
                isReturn
            />
        )}

        {/* Baggage Info */}
        <BaggageInfoCard flight={flight} />

        {/* Price & Action */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700 sticky bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                     <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</div>
                     <div className="text-3xl font-extrabold text-brand-blue dark:text-blue-400">
                        {formatPrice(flight.price)}
                     </div>
                     <div className="text-xs text-gray-400 mt-1">
                        {flight.inbound ? 'Round-trip' : 'One-way'} • per person • taxes included
                     </div>
                </div>
                
                <button 
                  onClick={handleProceed}
                  className="w-full md:w-auto bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-dark hover:to-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-brand-blue/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-lg"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
