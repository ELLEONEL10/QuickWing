import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, Globe, HelpCircle, User, Menu, Moon, Sun, X, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const getLinkClass = (path: string) => isActive(path) 
    ? "flex items-center gap-2 border-b-2 border-brand-blue dark:border-white pb-0.5 text-brand-blue dark:text-white"
    : "flex items-center gap-2 text-slate-600 hover:text-brand-blue dark:text-blue-200 dark:hover:text-white transition-colors pb-0.5 border-b-2 border-transparent";

  return (
    <header className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 text-slate-800 dark:text-white py-3 px-4 md:px-8 sticky top-0 z-50 shadow-sm dark:shadow-md transition-colors duration-300 border-b border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <img src={theme === 'dark' ? "/logo-dark.png" : "/Logo.png"} alt="QuikWing" className="h-10 w-auto object-contain" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={getLinkClass('/')}>
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/flights" className={getLinkClass('/flights')}>
            <Plane className="w-4 h-4" /> {t('search')}
          </Link>
          <Link to="/hotels" className={getLinkClass('/hotels')}>
            <Hotel className="w-4 h-4" /> Hotels
          </Link>
          <Link to="/help" className={getLinkClass('/help')}>
            <HelpCircle className="w-4 h-4" /> Help
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-blue-200" title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <div className="relative">
            <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-slate-600 hover:text-brand-blue dark:text-blue-200 dark:hover:text-white"
            >
              <Globe className="w-4 h-4" /> {language.toUpperCase()}
            </button>
            
            {isLangMenuOpen && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-24 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded shadow-lg py-1 border border-gray-100 dark:border-slate-700 z-20">
                {(['en', 'es', 'fr', 'ar'] as Language[]).map((lang) => (
                    <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 ${language === lang ? 'font-bold text-brand-blue dark:text-blue-400' : ''}`}
                    >
                    {lang.toUpperCase()}
                    </button>
                ))}
                </div>
                </>
            )}
          </div>
        </div>

        <Link to="/signin" className="flex items-center gap-2 bg-brand-blue/10 hover:bg-brand-blue/20 dark:bg-white/10 dark:hover:bg-white/20 text-brand-blue dark:text-white px-4 py-2 rounded-full transition-colors font-bold">
            <User className="w-4 h-4" />
            <span>Sign In</span>
        </Link>
        
        <button 
            className="md:hidden p-2 text-slate-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top-5 absolute top-full left-0 right-0 shadow-lg">
            <div className="flex flex-col p-4 gap-2">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-slate-800 dark:text-white p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <Plane className="w-5 h-5 text-brand-blue dark:text-blue-400" /> {t('search')}
                </Link>
                <Link to="/hotels" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-slate-800 dark:text-white p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <Hotel className="w-5 h-5 text-brand-blue dark:text-blue-400" /> Hotels
                </Link>
                <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-slate-800 dark:text-white p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <HelpCircle className="w-5 h-5 text-brand-blue dark:text-blue-400" /> Help
                </Link>
            </div>
        </nav>
      )}
    </header>
  );
};
