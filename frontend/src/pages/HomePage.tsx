import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar, CITY_CODES } from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentPosition } from '../utils/geolocation';
import { MapPin } from 'lucide-react'; 

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
    { city: 'New York', price: '$504', image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=800&auto=format&fit=crop' },
    { city: 'London', price: '$137', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' },
    { city: 'Paris', price: '$150', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop' },
    { city: 'Dubai', price: '$350', image: 'https://images.unsplash.com/photo-1512453979798-5ea904acfb5a?q=80&w=800&auto=format&fit=crop' },
    { city: 'Tokyo', price: '$620', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop' },
    { city: 'Rome', price: '$180', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' },
    { city: 'Barcelona', price: '$145', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop' },
    { city: 'Bali', price: '$490', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' },
    { city: 'Sydney', price: '$850', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop' }
  ];

  const handleDestinationClick = async (city: string) => {
    const destCode = CITY_CODES[city];
    if (destCode) {
        const params = new URLSearchParams();
        params.set('source', ''); // Intentionally empty so user can type
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
    <div className="flex-grow container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="mb-10 text-center max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-accent">
                Where to next?
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">Discover your next adventure with the best flight deals.</p>
        </div>

        <div className="w-full max-w-4xl mb-16 relative z-20">
            <SearchBar onSearch={handleSearch} isLoading={false} />
        </div>

        {/* Popular Destinations */}
        <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center">Popular destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                    <div 
                        key={dest.city} 
                        onClick={() => handleDestinationClick(dest.city)}
                        className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <img 
                            src={dest.image} 
                            alt={dest.city}
                            onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop';
                            }}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{dest.city}</h3>
                                    <div className="text-sm font-medium opacity-90">
                                        Flights from
                                    </div>
                                </div>
                                <div className="text-right">
                                     <span className="block text-xl font-bold text-brand-accent">{dest.price}</span>
                                     <span className="text-xs opacity-70">Round trip</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                 <button className="px-8 py-3 rounded-full border-2 border-gray-200 dark:border-slate-700 hover:border-brand-blue text-gray-600 dark:text-gray-300 hover:text-brand-blue font-semibold transition-all">
                    Show more destinations
                 </button>
            </div>
        </div>
    </div>
  );
};
