const { REACT_APP_API_BASE_URL, REACT_APP_API_TIMEOUT_MS } = process.env;

/**
 * Central API configuration.
 * Set env vars in .env (not committed) or use defaults in development.
 *
 * Notes:
 * - We normalize the base URL to avoid double slashes when composing paths.
 * - In development, we warn if the base URL is missing or appears incorrect for the current origin.
 */
function normalizeBaseUrl(url) {
  if (!url) return url;
  // Remove trailing slash to keep consistent join behavior
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const rawBaseUrl = REACT_APP_API_BASE_URL || 'http://localhost:4000';
export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);
export const DEFAULT_TIMEOUT_MS = Number(REACT_APP_API_TIMEOUT_MS || 15000);

// Dev-time diagnostics to help identify "Network Error" root causes
if (process.env.NODE_ENV !== 'production') {
  const origin = typeof window !== 'undefined' ? window.location.origin : '(no-window)';
  if (!REACT_APP_API_BASE_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[apiConfig] REACT_APP_API_BASE_URL is not set. Falling back to http://localhost:4000. ' +
        `Current page origin: ${origin}. If your backend is not on localhost:4000 or CORS is not configured, ` +
        'API calls may fail with "Network Error". Configure .env using .env.example.'
    );
  } else {
    // eslint-disable-next-line no-console
    console.info(`[apiConfig] Using REACT_APP_API_BASE_URL=${API_BASE_URL} (origin: ${origin})`);
  }
}
