import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Flight, Leg } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, Clock, ChevronRight, ArrowRight, Luggage, Info } from 'lucide-react';

const FlightLegDetails: React.FC<{ leg: Leg; title: string }> = ({ leg, title }) => {
    const { t } = useLanguage();
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-blue dark:text-blue-400">
                <div className="w-1 h-6 bg-brand-blue dark:bg-blue-400 rounded-full"></div>
                {title}
            </h3>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                     <div className="flex items-start gap-4 mb-6 relative">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full border-2 border-brand-blue dark:border-blue-400 bg-white dark:bg-slate-800 z-10"></div>
                            <div className="w-0.5 h-16 bg-gray-200 dark:bg-slate-700 -my-1"></div>
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-slate-500 bg-white dark:bg-slate-800 z-10"></div>
                        </div>
                        <div className="flex-1">
                            <div className="mb-8">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{leg.departureTime}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{leg.origin}</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{leg.arrivalTime}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{leg.destination}</div>
                            </div>
                        </div>
                     </div>
                </div>
                
                <div className="flex-1 space-y-4">
                     <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{leg.duration}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-bold">
                            {leg.carrier.substring(0, 1)}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Airline</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{leg.carrier}</div>
                        </div>
                     </div>
                     
                     {leg.stops > 0 && (
                         <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="font-bold mb-1">{leg.stops} Stop(s)</div>
                                <div className="text-sm opacity-90">Layovers in {leg.stopAirports?.join(", ")}</div>
                            </div>
                         </div>
                     )}
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Luggage info removed as it is not provided by API */}
            </div>
        </div>
    );
}

export const FlightDetailsPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
             <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span>
             <ChevronRight className="w-4 h-4" />
             <span className="text-brand-blue dark:text-blue-400">Flight Details</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Review your trip</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Check the details before proceeding to payment.</p>

        <FlightLegDetails leg={flight.outbound} title={`${flight.outbound.origin} → ${flight.outbound.destination}`} />
        
        {flight.inbound && (
            <FlightLegDetails leg={flight.inbound} title={`${flight.inbound.origin} → ${flight.inbound.destination}`} />
        )}

        {/* Price & Action */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700 sticky bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                     <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</div>
                     <div className="text-3xl font-extrabold text-brand-blue dark:text-blue-400">
                        {flight.price} {flight.currency}
                     </div>
                </div>
                
                <button 
                  onClick={handleProceed}
                  className="w-full md:w-auto bg-brand-blue hover:bg-brand-dark text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-brand-blue/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-lg"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
