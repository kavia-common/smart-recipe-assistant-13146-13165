import axios from 'axios';
import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from './apiConfig';

/**
 * HTTP client wrapper using Axios.
 * Interceptors and auth headers can be added later.
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
});

export default httpClient;
