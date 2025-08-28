import axios from 'axios';
import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from './apiConfig';

/**
 * HTTP client wrapper using Axios.
 * Interceptors and auth headers can be added later.
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});

// Basic response interceptor to surface better diagnostics in development.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(
        '[httpClient] Request failed:',
        {
          url: error?.config?.baseURL
            ? `${error.config.baseURL}${error.config.url || ''}`
            : error?.config?.url,
          method: error?.config?.method,
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        }
      );
    }
    return Promise.reject(error);
  }
);

export default httpClient;
