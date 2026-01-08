import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<string, number>;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    // Fetch live rates
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch currency rates', error);
        // Fallback rates if API fails
        setRates({
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 151.5,
            AUD: 1.52,
            CAD: 1.36,
            CHF: 0.91,
            CNY: 7.23,
            INR: 83.5
        });
      }
    };

    fetchRates();
    // Refresh every hour
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (priceInUSD: number) => {
    const rate = rates[currency] || 1;
    return priceInUSD * rate;
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = convertPrice(priceInUSD);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
