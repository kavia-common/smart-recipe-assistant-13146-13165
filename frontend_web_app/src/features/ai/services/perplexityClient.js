import httpClient from '../../../services/httpClient';

/**
 * PUBLIC_INTERFACE
 * suggestRecipes sends a request to the backend Perplexity proxy endpoint to get AI-powered
 * recipe suggestions and step-by-step guidance. This client intentionally does not call
 * Perplexity directly from the browser; instead, it calls our backend route:
 *   POST {REACT_APP_API_BASE_URL}/ai/perplexity/suggest
 *
 * SECURITY NOTES
 * - Do NOT expose Perplexity API keys in frontend code; the backend should securely
 *   store and use the provider credentials.
 * - The frontend should only call our backend endpoint using the shared httpClient,
 *   which uses REACT_APP_API_BASE_URL from src/services/apiConfig.js.
 *
 * ENVIRONMENT VARIABLES
 * - REACT_APP_API_BASE_URL: Base URL of the backend (e.g., http://localhost:4000)
 *   This value is read and configured in src/services/apiConfig.js.
 *
 * PAYLOAD CONTRACT (example)
 * - ingredients: string[]            e.g., ['chicken breast', 'broccoli', 'garlic']
 * - preferences?: { diet?: string, cuisine?: string, excludes?: string[] }
 * - servings?: number
 * - guidanceLevel?: 'quick' | 'detailed'
 *
 * RESPONSE CONTRACT (example)
 * {
 *   "suggestions": [
 *     {
 *       "title": "Garlic Chicken with Broccoli",
 *       "summary": "A quick, protein-rich stir-fry ...",
 *       "ingredients": ["chicken breast", "broccoli", "garlic", "soy sauce", "oil"],
 *       "steps": ["Cut chicken...", "Heat pan...", "Add broccoli..."],
 *       "nutrition": { "calories": 480, "protein": "35g", "carbs": "20g", "fat": "22g" }
 *     }
 *   ],
 *   "model": "perplexity-.../version",
 *   "meta": { "generatedAt": "2025-01-01T12:00:00Z" }
 * }
 */

/**
 * Shape of the request payload passed to suggestRecipes.
 * @typedef {Object} SuggestRequest
 * @property {string[]} ingredients - List of available ingredients.
 * @property {Object} [preferences] - Optional user preferences (diet, cuisine, excludes, etc.).
 * @property {number} [servings] - Optional number of servings.
 * @property {'quick'|'detailed'} [guidanceLevel] - Level of guidance to request.
 */

/**
 * PUBLIC_INTERFACE
 * suggestRecipes
 * Sends a POST request to the backend Perplexity suggestion endpoint with the provided payload.
 *
 * @param {SuggestRequest} payload - The request body with ingredients and options.
 * @returns {Promise<any>} The parsed JSON response from the backend containing suggestions.
 *
 * USAGE
 * import perplexityClient from '@/features/ai/services/perplexityClient';
 * const data = await perplexityClient.suggestRecipes({ ingredients: ['tomato', 'basil'] });
 */
async function suggestRecipes(payload) {
  if (!payload || !Array.isArray(payload.ingredients)) {
    throw new Error('suggestRecipes requires a payload with an ingredients array.');
  }
  // defensive: ensure the array is not empty
  if (payload.ingredients.length === 0) {
    throw new Error('Please provide at least one ingredient.');
  }

  try {
    const { data } = await httpClient.post('/ai/perplexity/suggest', payload);
    return data;
  } catch (err) {
    // Build a more helpful message for common Axios/network scenarios
    const status = err?.response?.status;
    const backendMsg = err?.response?.data?.message || err?.response?.data?.error;
    const isNetworkError = err?.message && /Network Error/i.test(err.message);

    let message = 'Failed to fetch AI suggestions.';
    if (isNetworkError) {
      message =
        'Network error while contacting the AI service. ' +
        'Please ensure the backend is reachable and REACT_APP_API_BASE_URL is set correctly. ' +
        'If you are running in a preview environment, localhost:4000 will not be accessible.';
    } else if (status) {
      message = `AI service request failed (${status}).`;
      if (backendMsg) message += ` ${backendMsg}`;
    } else if (backendMsg) {
      message = backendMsg;
    }

    const enhancedError = new Error(message);
    enhancedError.cause = err;
    throw enhancedError;
  }
}

const perplexityClient = {
  suggestRecipes,
};

export default perplexityClient;
