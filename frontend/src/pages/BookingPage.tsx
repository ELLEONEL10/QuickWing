import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, User, Plane, Lock, CheckCircle2, 
  Clock, Luggage, Calendar, MapPin, ChevronRight, Sparkles,
  Mail, Phone, Globe, Tag, Gift, AlertCircle, ArrowRight
} from 'lucide-react';
import { Flight } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const flight = location.state?.flight as Flight;

  if (!flight) {
      return <Navigate to="/" replace />;
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    }
  };

  const discount = promoApplied ? flight.price * 0.1 : 0;
  const finalPrice = flight.price - discount;

  return (
    <div className="flex-grow bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
          {/* Main Booking Form */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete your booking</h1>
              <p className="text-gray-500 dark:text-gray-400">You're just a few steps away from your next adventure</p>
            </div>
            
            {/* Progress Steps */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: 'Passengers', icon: User },
                  { num: 2, label: 'Payment', icon: CreditCard },
                  { num: 3, label: 'Confirmation', icon: CheckCircle2 }
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div className={`flex items-center gap-3 ${step >= s.num ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                        step > s.num 
                          ? 'bg-green-500 text-white' 
                          : step === s.num 
                            ? 'bg-gradient-to-br from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/30' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                      }`}>
                        {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                      </div>
                      <div className="hidden md:block">
                        <div className="font-bold text-sm">{s.label}</div>
                        <div className="text-xs text-gray-400">Step {s.num}</div>
                      </div>
                    </div>
                    {idx < 2 && (
                      <div className="flex-1 mx-4 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-brand-blue to-blue-600 transition-all duration-500 ${
                          step > s.num ? 'w-full' : 'w-0'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              {step === 1 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Passenger Details</h2>
                      <p className="text-sm text-gray-500">Enter the details as shown on your passport</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all" 
                          placeholder="John" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" /> Email Address *
                        </label>
                        <input 
                          type="email" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all" 
                          placeholder="john.doe@example.com" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                        </label>
                        <input 
                          type="tel" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all" 
                          placeholder="+1 (555) 123-4567" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" /> Date of Birth *
                        </label>
                        <input 
                          type="date" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" /> Nationality
                        </label>
                        <select className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all">
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Special Requests (Optional)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-800 transition-all resize-none" 
                        rows={3}
                        placeholder="Wheelchair assistance, dietary requirements, etc."
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full mt-8 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-dark hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                      <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">Secure Payment</p>
                      <p className="text-sm text-green-600 dark:text-green-400">256-bit SSL encryption protects your information</p>
                    </div>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', label: 'Credit Card', icon: '💳' },
                      { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                      { id: 'apple', label: 'Apple Pay', icon: '🍎' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className={`text-sm font-semibold ${paymentMethod === method.id ? 'text-brand-blue' : 'text-gray-700 dark:text-gray-300'}`}>
                          {method.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue transition-all" 
                            placeholder="1234 5678 9012 3456" 
                          />
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                          <input 
                            type="text" 
                            className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue transition-all" 
                            placeholder="MM / YY" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Security Code</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              className="w-full p-4 pr-12 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue transition-all" 
                              placeholder="CVC" 
                            />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-blue transition-all" 
                          placeholder="JOHN DOE" 
                        />
                      </div>

                      {/* Accepted Cards */}
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-xs text-gray-500">Accepted:</span>
                        <div className="flex gap-1">
                          {['Visa', 'Mastercard', 'Amex', 'Discover'].map(card => (
                            <div key={card} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                              {card}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🅿️</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                  )}

                  {paymentMethod === 'apple' && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🍎</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Click the button below to pay with Apple Pay</p>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" /> Promo Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                          className={`w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-xl outline-none transition-all ${
                            promoApplied 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                              : 'border-gray-200 dark:border-slate-700 focus:border-brand-blue'
                          }`}
                          placeholder="Enter code (try SAVE10)" 
                        />
                        {promoApplied && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <button 
                        onClick={applyPromo}
                        disabled={promoApplied || !promoCode}
                        className={`px-6 rounded-xl font-semibold transition-all ${
                          promoApplied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {promoApplied ? 'Applied!' : 'Apply'}
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
                        <Gift className="w-4 h-4" /> You saved {formatPrice(discount)}!
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button 
                      onClick={() => setStep(1)} 
                      className="flex-1 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" /> Pay {formatPrice(finalPrice)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12 px-8">
                  {/* Success Animation */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 inline animate-pulse" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Your flight has been successfully booked</p>
                  
                  <div className="inline-block bg-gray-100 dark:bg-slate-700 px-6 py-3 rounded-xl mb-8">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Booking Reference</span>
                    <div className="text-2xl font-bold font-mono text-brand-blue">#QW-{Math.floor(Math.random()*90000 + 10000)}</div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 text-left">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-blue mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Confirmation sent!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A confirmation email with your e-ticket has been sent to your email address.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => window.print()}
                      className="px-8 py-3 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                    >
                      Print Ticket
                    </button>
                    <button 
                      onClick={() => window.location.href = '/'} 
                      className="px-8 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-brand-blue/30 hover:from-brand-dark hover:to-blue-700 transition-all"
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flight Summary Sidebar */}
          <div className="lg:w-[380px]">
            <div className="sticky top-24 space-y-4">
              {/* Trip Summary Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Plane className="w-5 h-5" /> Your Trip
                  </h3>
                </div>
                
                <div className="p-5">
                  {/* Outbound */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-wide mb-3">
                      <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                      Outbound Flight
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.outbound.originCode || flight.outbound.origin}</div>
                            <div className="text-sm text-gray-500">{flight.outbound.departureTime}</div>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-slate-600"></div>
                            <Plane className="w-4 h-4 text-brand-blue" />
                            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-slate-600"></div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.outbound.destinationCode || flight.outbound.destination}</div>
                            <div className="text-sm text-gray-500">{flight.outbound.arrivalTime}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {flight.outbound.duration}
                          </span>
                          <span className={flight.outbound.stops === 0 ? 'text-green-600' : 'text-amber-600'}>
                            {flight.outbound.stops === 0 ? 'Direct' : `${flight.outbound.stops} stop`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inbound if exists */}
                  {flight.inbound && (
                    <div className="pt-5 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wide mb-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        Return Flight
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.inbound.originCode || flight.inbound.origin}</div>
                              <div className="text-sm text-gray-500">{flight.inbound.departureTime}</div>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 h-0.5 bg-gray-200 dark:bg-slate-600"></div>
                              <Plane className="w-4 h-4 text-purple-600 rotate-180" />
                              <div className="flex-1 h-0.5 bg-gray-200 dark:bg-slate-600"></div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.inbound.destinationCode || flight.inbound.destination}</div>
                              <div className="text-sm text-gray-500">{flight.inbound.arrivalTime}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {flight.inbound.duration}
                            </span>
                            <span className={flight.inbound.stops === 0 ? 'text-green-600' : 'text-amber-600'}>
                              {flight.inbound.stops === 0 ? 'Direct' : `${flight.inbound.stops} stop`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Baggage Info */}
                  {flight.baggageInfo && (
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Luggage className="w-4 h-4" />
                        <span>
                          {(flight.baggageInfo.cabinBagIncluded || 0) > 0 ? '✓ Cabin bag' : '✗ No cabin bag'}
                          {' • '}
                          {(flight.baggageInfo.checkedBagIncluded || 0) > 0 ? '✓ Checked bag' : '✗ No checked bag'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Price Breakdown</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Flight ({flight.inbound ? 'Round-trip' : 'One-way'})</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(flight.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Promo discount
                      </span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <div className="text-right">
                      {promoApplied && (
                        <div className="text-sm text-gray-400 line-through">{formatPrice(flight.price)}</div>
                      )}
                      <div className="text-2xl font-bold text-brand-blue">{formatPrice(finalPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
