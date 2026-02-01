import apiClient from '../core/apiClient';
import { BASE_CURRENCY } from '../config/constants';

/**
 * Interface for Exchange Rate Response
 */
export interface ExchangeRateResponse {
    result: string;
    base_code: string;
    rates: {
        [key: string]: number;
    };
    time_last_update_utc: string;
}

/**
 * Service to handle all currency-related API calls
 */
export const CurrencyService = {
    /**
     * Fetches live exchange rates for a given base currency
     */
    getLiveRates: async (base: string = BASE_CURRENCY): Promise<ExchangeRateResponse> => {
        try {
            const response = await apiClient.get<ExchangeRateResponse>(base);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch live rates:', error);
            throw error;
        }
    }
};
