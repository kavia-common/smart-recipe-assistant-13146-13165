import { useCallback, useMemo, useState } from 'react';
import perplexityClient from '../services/perplexityClient';

/**
 * PUBLIC_INTERFACE
 * useAiSuggestions is a reusable React hook that fetches AI-powered recipe suggestions
 * and step-by-step guidance by calling the backend Perplexity proxy endpoint via the
 * feature client (perplexityClient).
 *
 * It manages loading, error, and data state, and exposes an imperative suggest function.
 *
 * SECURITY AND ENVIRONMENT
 * - This hook does NOT contact Perplexity directly. It calls our backend:
 *   POST {REACT_APP_API_BASE_URL}/ai/perplexity/suggest
 * - The base URL is configured in src/services/apiConfig.js using the env var:
 *   REACT_APP_API_BASE_URL
 * - Ensure .env contains a value for REACT_APP_API_BASE_URL (not committed to VCS).
 *
 * EXAMPLE
 * const { data, loading, error, suggest, reset } = useAiSuggestions();
 * const onSuggest = async () => {
 *   await suggest({
 *     ingredients: ['tomato', 'mozzarella', 'basil'],
 *     preferences: { diet: 'vegetarian', excludes: ['peanut'] },
 *     servings: 2,
 *     guidanceLevel: 'detailed',
 *   });
 * };
 *
 * RENDERING
 * if (loading) return <Spinner />;
 * if (error) return <ErrorBanner message={error.message} />;
 * return <RecipeList items={data?.suggestions ?? []} />;
 */
export default function useAiSuggestions(initialState = null) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * PUBLIC_INTERFACE
   * suggest triggers the AI suggestion request.
   * @param {Object} params - Request body. Requires params.ingredients: string[]
   * @returns {Promise<void>}
   */
  const suggest = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await perplexityClient.suggestRecipes(params);
      setData(res);
    } catch (e) {
      // Normalize error to ensure .message is present for UI
      const normalized = e instanceof Error ? e : new Error('Failed to fetch AI suggestions.');
      setError(normalized);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * PUBLIC_INTERFACE
   * reset clears data and error state.
   */
  const reset = useCallback(() => {
    setData(initialState ?? null);
    setError(null);
  }, [initialState]);

  const state = useMemo(
    () => ({ data, loading, error }),
    [data, loading, error]
  );

  return {
    ...state,
    suggest,
    reset,
  };
}
