import axios from 'axios';
import { CURRENCY_API_BASE_URL, API_TIMEOUT } from '../config/constants';

/**
 * Professional Axios Client setup with base configuration
 */
const apiClient = axios.create({
    baseURL: CURRENCY_API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
