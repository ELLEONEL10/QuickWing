import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar, CITY_CODES } from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Plane, Shield, Clock, CreditCard, Star, TrendingUp, Globe } from 'lucide-react'; 

export const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (from: string, to: string, passengers: number, flightClass: string, departureDate: string, returnDate: string) => {
    const params = new URLSearchParams();
    params.set('source', from);
    params.set('destination', to);
    params.set('adults', passengers.toString());
    params.set('cabin_class', flightClass);
    if (departureDate) {
        params.set('outbound_department_date_start', departureDate);
        params.set('outbound_department_date_end', departureDate);
    }
    if (returnDate) {
        params.set('inbound_departure_date_start', returnDate);
        params.set('inbound_departure_date_end', returnDate);
    }
    navigate(`/flights?${params.toString()}`);
  };

  const destinations = [
    { city: 'New York', country: 'USA', price: '$504', image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=800&auto=format&fit=crop', tag: 'Popular' },
    { city: 'London', country: 'UK', price: '$137', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', tag: 'Trending' },
    { city: 'Paris', country: 'France', price: '$150', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', tag: 'Best Deal' },
    { city: 'Dubai', country: 'UAE', price: '$350', image: 'https://images.unsplash.com/photo-1512453979798-5ea904acfb5a?q=80&w=800&auto=format&fit=crop' },
    { city: 'Tokyo', country: 'Japan', price: '$620', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop' },
    { city: 'Rome', country: 'Italy', price: '$180', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' },
  ];

  const features = [
    { icon: Shield, title: 'Secure Booking', desc: 'Your payment information is always protected' },
    { icon: Clock, title: 'Real-time Updates', desc: 'Get instant notifications on your flight status' },
    { icon: CreditCard, title: 'Best Price Guarantee', desc: 'Find a lower price? We\'ll match it!' },
    { icon: Globe, title: '500+ Airlines', desc: 'Access to flights from all major carriers worldwide' },
  ];

  const handleDestinationClick = async (city: string) => {
    const destCode = CITY_CODES[city];
    if (destCode) {
        const params = new URLSearchParams();
        params.set('source', '');
        params.set('destination', destCode);
        params.set('adults', '1');
        params.set('cabin_class', 'economy');
        const today = new Date();
        const nextMonth = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
        params.set('outbound_department_date_start', nextMonth);
        params.set('outbound_department_date_end', nextMonth);
        navigate(`/flights?${params.toString()}`);
    }
  };

  return (
    <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-purple-500/5 dark:from-brand-blue/10 dark:to-purple-500/10"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center justify-center min-h-[70vh] relative z-10">
                {/* Badge */}
                <div className="mb-6 px-4 py-2 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center gap-2 border border-brand-blue/20">
                    <Plane className="w-4 h-4 text-brand-blue" />
                    <span className="text-sm font-medium text-brand-blue dark:text-blue-400">Find your perfect flight</span>
                </div>
                
                {/* Hero Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center max-w-4xl">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-brand-blue to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400">
                        Where will your
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-accent">
                        next adventure take you?
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl">
                    Compare prices from 500+ airlines and travel sites to find the cheapest flights for your next trip.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-4xl relative z-20">
                    <SearchBar onSearch={handleSearch} isLoading={false} />
                </div>
                
                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>4.8/5 from 10,000+ reviews</span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure & trusted</span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-brand-blue" />
                        <span>Best price guarantee</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Popular Destinations */}
        <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Popular Destinations</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Explore trending destinations with the best deals</p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-brand-blue hover:text-brand-dark font-semibold transition-colors">
                    View all <Plane className="w-4 h-4" />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest, index) => (
                    <div 
                        key={dest.city} 
                        onClick={() => handleDestinationClick(dest.city)}
                        className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                            index === 0 ? 'md:row-span-2 aspect-[4/5] md:aspect-auto' : 'aspect-[4/3]'
                        }`}
                    >
                        <img 
                            src={dest.image} 
                            alt={dest.city}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop';
                            }}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        
                        {/* Tag */}
                        {dest.tag && (
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    dest.tag === 'Best Deal' ? 'bg-green-500 text-white' :
                                    dest.tag === 'Trending' ? 'bg-purple-500 text-white' :
                                    'bg-brand-blue text-white'
                                }`}>
                                    {dest.tag}
                                </span>
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-1 group-hover:text-brand-accent transition-colors">{dest.city}</h3>
                                    <div className="flex items-center gap-1 text-sm font-medium text-white/80">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {dest.country}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-white/70 block">from</span>
                                    <span className="text-2xl font-bold text-brand-accent">{dest.price}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-6 py-3 bg-white rounded-xl font-bold text-brand-blue shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                Explore Flights
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 dark:bg-slate-900/50 py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Why book with QuickWing?</h2>
                    <p className="text-gray-500 dark:text-gray-400">The smarter way to find and book your flights</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 group hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:scale-110 transition-all">
                                <feature.icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-blue to-purple-600 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to take off?</h2>
                        <p className="text-white/80 max-w-lg">Sign up now and get exclusive deals on your first booking. Plus, earn reward points with every flight!</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-brand-blue font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap">
                        Get Started Free <Plane className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
