import React, { useEffect, useState } from 'react';
import { Plane, Cloud } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600 transition-opacity duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Clouds Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Cloud className="absolute text-white/20 w-32 h-32 top-10 left-10 animate-float" style={{ animationDuration: '8s' }} />
        <Cloud className="absolute text-white/20 w-48 h-48 top-1/3 right-20 animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        <Cloud className="absolute text-white/20 w-24 h-24 bottom-20 left-1/4 animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <Cloud className="absolute text-white/10 w-64 h-64 -bottom-10 -right-10 animate-float" style={{ animationDuration: '15s' }} />
      </div>

      {/* Logo and Plane */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transform scale-150"></div>
            <img src="/logo-light.png" alt="QuikWing" className="w-32 h-32 object-contain relative z-10 drop-shadow-lg animate-bounce-slow" />
            <Plane className="absolute -right-8 -top-8 text-white w-12 h-12 animate-fly-diagonal" />
        </div>
        
        <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-md mb-2">QuikWing</h1>
        <p className="text-blue-100 text-lg tracking-widest uppercase text-sm">Explore the World</p>
        
        <div className="mt-12 w-48 h-1 bg-blue-800/30 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-progress origin-left"></div>
        </div>
      </div>
    </div>
  );
};
