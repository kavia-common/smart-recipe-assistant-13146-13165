const { REACT_APP_API_BASE_URL, REACT_APP_API_TIMEOUT_MS } = process.env;

/**
 * Central API configuration.
 * Set env vars in .env (not committed) or use defaults in development.
 */
export const API_BASE_URL = REACT_APP_API_BASE_URL || 'http://localhost:4000';
export const DEFAULT_TIMEOUT_MS = Number(REACT_APP_API_TIMEOUT_MS || 15000);
