import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { Background } from './components/Background';
import { useTheme } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { FlightDetailsPage } from './pages/FlightDetailsPage';
import { HotelsPage } from './pages/HotelsPage';
import { HelpPage } from './pages/HelpPage';
import { SignInPage } from './pages/SignInPage';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { theme } = useTheme();

  return (
    <Router>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className={`min-h-screen font-sans pb-12 transition-colors duration-300 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-brand-light text-slate-800'}`}>
        
        <Background />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flight-details" element={<FlightDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
          
          <footer className="mt-auto py-8 text-center text-slate-500 text-sm">
              <p>&copy; 2025 QuikWing. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;
