import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, User, Plane } from 'lucide-react';
import { Flight } from '../types';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const flight = location.state?.flight as Flight;

  if (!flight) {
      return <Navigate to="/" replace />;
  }

  return (
    <div className="flex-grow container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Main Booking Form */}
        <div className="flex-1">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Complete your booking</h1>
            
            {/* Steps */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <span className="font-bold hidden md:inline">Passengers</span>
                </div>
                <div className="flex-1 h-[2px] bg-gray-200 dark:bg-slate-700 mx-4">
                    <div className={`h-full bg-brand-blue transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    <span className="font-bold hidden md:inline">Payment</span>
                </div>
                <div className="flex-1 h-[2px] bg-gray-200 dark:bg-slate-700 mx-4">
                    <div className={`h-full bg-brand-blue transition-all duration-500 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                    <span className="font-bold hidden md:inline">Confirmation</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <User className="w-5 h-5 text-brand-blue" /> Passenger Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="Doe" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input type="email" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="john.doe@example.com" />
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-dark transition-colors">
                            Continue to Payment
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <CreditCard className="w-5 h-5 text-brand-blue" /> Payment Method
                        </h2>
                        <div className="p-4 border border-brand-blue/30 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-6 h-6 text-brand-blue" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">Your payment is secure and encrypted.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="Card Number" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="MM/YY" />
                                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue" placeholder="CVC" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                Back
                            </button>
                            <button onClick={() => setStep(3)} className="flex-[2] bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors">
                                Pay Now {flight.price} {flight.currency}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Your flight has been successfully booked. Reference: #QW-{Math.floor(Math.random()*10000)}</p>
                        <button onClick={() => window.location.href = '/'} className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-dark transition-colors">
                            Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Flight Summary Sidebar */}
        <div className="lg:w-1/3">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Your Trip</h3>
                
                {/* Outbound */}
                <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="font-bold text-brand-blue">Outbound</span> • {flight.outbound.departureTime?.split(' ')[0] || 'Date'}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                         <div>
                            <div className="font-bold text-xl">{flight.outbound.origin}</div>
                            <div className="text-sm text-gray-500">{flight.outbound.departureTime}</div>
                         </div>
                         <Plane className="w-4 h-4 text-gray-400 mt-1.5" />
                         <div className="text-right">
                            <div className="font-bold text-xl">{flight.outbound.destination}</div>
                            <div className="text-sm text-gray-500">{flight.outbound.arrivalTime}</div>
                         </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <img src={`https://logo.clearbit.com/${flight.outbound.carrier.toLowerCase().replace(' ', '')}.com`} className="w-4 h-4 rounded-full" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                        {flight.outbound.carrier} • {flight.outbound.duration}
                    </div>
                </div>

                {/* Inbound if exists */}
                {flight.inbound && (
                    <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span className="font-bold text-brand-blue">Return</span> • {flight.inbound.departureTime?.split(' ')[0] || 'Date'}
                        </div>
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <div className="font-bold text-xl">{flight.inbound.origin}</div>
                                <div className="text-sm text-gray-500">{flight.inbound.departureTime}</div>
                             </div>
                             <Plane className="w-4 h-4 text-gray-400 mt-1.5 rotate-180" />
                             <div className="text-right">
                                <div className="font-bold text-xl">{flight.inbound.destination}</div>
                                <div className="text-sm text-gray-500">{flight.inbound.arrivalTime}</div>
                             </div>
                        </div>
                         <div className="text-xs text-gray-500 flex items-center gap-2">
                            <img src={`https://logo.clearbit.com/${flight.inbound.carrier.toLowerCase().replace(' ', '')}.com`} className="w-4 h-4 rounded-full" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                            {flight.inbound.carrier} • {flight.inbound.duration}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center text-xl font-bold pt-2">
                    <span>Total</span>
                    <span className="text-brand-blue">{flight.price} {flight.currency}</span>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
