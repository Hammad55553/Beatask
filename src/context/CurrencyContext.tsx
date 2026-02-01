import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyService } from '../api/services/currencyService';

export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (price: number) => string;
    currencySymbol: string;
    loading: boolean;
    refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fallback rates if API fails
const FALLBACK_RATES: Record<Currency, { symbol: string; rate: number }> = {
    PKR: { symbol: 'Rs', rate: 280 },
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>('USD');
    const [rates, setRates] = useState<Record<string, number>>(
        Object.keys(FALLBACK_RATES).reduce((acc, key) => ({
            ...acc,
            [key]: FALLBACK_RATES[key as Currency].rate
        }), {})
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const data = await CurrencyService.getLiveRates('USD');
            if (data && data.rates) {
                setRates(data.rates);
                console.log('Live rates updated successfully! 🤴🏻💰');
            }
        } catch (error) {
            console.warn('Using fallback rates due to API error');
        } finally {
            setLoading(false);
        }
    };

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
    };

    const formatPrice = (priceInUSD: number) => {
        // Get symbol from fallback config as it's static
        const symbol = FALLBACK_RATES[currency].symbol;

        // Get live rate or fallback
        const rate = rates[currency] || FALLBACK_RATES[currency].rate;
        const converted = priceInUSD * rate;

        if (currency === 'PKR') {
            return `${symbol} ${Math.round(converted).toLocaleString()}`;
        }
        return `${symbol}${converted.toFixed(2)}`;
    };

    const value = {
        currency,
        setCurrency,
        formatPrice,
        currencySymbol: FALLBACK_RATES[currency].symbol,
        loading,
        refreshRates: fetchRates,
    };

    return (
        <CurrencyContext.Provider value={value}>
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
