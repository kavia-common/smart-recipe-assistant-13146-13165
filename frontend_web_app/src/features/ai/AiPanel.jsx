import React, { useMemo, useState, useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { useAiSuggestions } from './hooks';

/**
 * PUBLIC_INTERFACE
 * AiPanel
 * A self-contained UI panel to interact with Perplexity-powered recipe features.
 *
 * Features:
 * - Enter ingredients (comma-separated), select optional preferences (diet, excludes, servings).
 * - Two modes:
 *    1) Discover: get recipe suggestions, rendered similar to RecipeCard list.
 *    2) Guide: chat-like step-by-step guidance; maintains conversational turns locally.
 * - Uses useAiSuggestions hook to call backend. Shows loading and error states.
 *
 * Environment:
 * - Uses configured httpClient base URL from src/services/apiConfig.js.
 *
 * Props:
 * - initialIngredients?: string[]        // optional initial ingredients to prefill input
 * - initialDiet?: string                 // optional initial diet (e.g., 'vegetarian')
 * - initialExcludes?: string[]           // optional list of excluded ingredients
 * - initialServings?: number             // optional servings count to prefill
 *
 * Usage:
 *   import AiPanel from '@/features/ai/AiPanel';
 *   <AiPanel initialIngredients={['tomato', 'basil']} initialDiet="vegetarian" />
 */
export default function AiPanel({
  initialIngredients,
  initialDiet,
  initialExcludes,
  initialServings,
}) {
  // UI state
  const [mode, setMode] = useState('discover'); // 'discover' | 'guide'
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [diet, setDiet] = useState('');
  const [excludes, setExcludes] = useState('');
  const [servings, setServings] = useState('');
  const [guidanceLevel, setGuidanceLevel] = useState('quick'); // 'quick' | 'detailed'
  const [guidePrompt, setGuidePrompt] = useState('');
  const [chat, setChat] = useState([]); // local simple chat transcript [{role:'user'|'assistant', content:string}]

  const { data, loading, error, suggest, reset } = useAiSuggestions();

  // Prefill from optional props (profile or demo context)
  useEffect(() => {
    if (Array.isArray(initialIngredients) && initialIngredients.length > 0) {
      setIngredientsInput(initialIngredients.join(', '));
    }
  }, [initialIngredients]);
  useEffect(() => {
    if (typeof initialDiet === 'string') setDiet(initialDiet);
  }, [initialDiet]);
  useEffect(() => {
    if (Array.isArray(initialExcludes) && initialExcludes.length > 0) {
      setExcludes(initialExcludes.join(', '));
    }
  }, [initialExcludes]);
  useEffect(() => {
    if (typeof initialServings === 'number' && !Number.isNaN(initialServings)) {
      setServings(String(initialServings));
    }
  }, [initialServings]);

  const ingredients = useMemo(
    () =>
      ingredientsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [ingredientsInput]
  );

  const excludesList = useMemo(
    () =>
      excludes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [excludes]
  );

  const onRunDiscover = async (e) => {
    e?.preventDefault?.();
    reset();
    await suggest({
      ingredients,
      preferences: {
        diet: diet || undefined,
        excludes: excludesList.length ? excludesList : undefined,
      },
      servings: servings ? Number(servings) : undefined,
      guidanceLevel,
      mode: 'discover',
    });
  };

  const onRunGuide = async (e) => {
    e?.preventDefault?.();
    if (!guidePrompt.trim() && chat.length === 0 && ingredients.length === 0) return;
    // Record user message locally first
    const updated = guidePrompt.trim()
      ? [...chat, { role: 'user', content: guidePrompt.trim() }]
      : [...chat];
    setChat(updated);
    setGuidePrompt('');
    // Call AI for guidance using current context (ingredients + transcript summary)
    await suggest({
      ingredients,
      preferences: {
        diet: diet || undefined,
        excludes: excludesList.length ? excludesList : undefined,
      },
      servings: servings ? Number(servings) : undefined,
      guidanceLevel,
      mode: 'guide',
      // For a simple backend contract, pass chat messages as context if supported.
      // If backend doesn't support chat yet, it can use prompt as a single turn.
      prompt: updated.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n'),
    });

    // If the response includes 'message' or 'steps' etc., append assistant turn
    if (data && (data.message || data.steps || data.suggestions)) {
      const assistantContent = formatAssistantMessage(data);
      setChat((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
    } else {
      // Optimistically read after await; if hook state updates next tick, we can also check in an effect.
      // Fallback: when loading finishes, another click will update transcript.
    }
  };

  // Helper to normalize assistant message
  const formatAssistantMessage = (payload) => {
    if (!payload) return 'I have updated suggestions.';
    if (payload.message) return payload.message;
    if (payload.steps && Array.isArray(payload.steps)) {
      return payload.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    }
    if (payload.suggestions && Array.isArray(payload.suggestions)) {
      // Summarize top suggestion for chat display
      const first = payload.suggestions[0];
      if (first?.title && first?.steps) {
        return `Let's make "${first.title}". Steps:\n${first.steps
          .map((s, i) => `${i + 1}. ${s}`)
          .join('\n')}`;
      }
      if (first?.title && first?.summary) {
        return `Suggestion: ${first.title}\n${first.summary}`;
      }
      return 'Here are some suggestions you can try.';
    }
    return 'Here is the guidance based on your input.';
  };

  const onClear = () => {
    setIngredientsInput('');
    setDiet('');
    setExcludes('');
    setServings('');
    setGuidanceLevel('quick');
    setGuidePrompt('');
    setChat([]);
    reset();
  };

  const renderDiscoverResults = () => {
    const suggestions = data?.suggestions || [];
    if (!loading && !error && suggestions.length === 0) {
      return (
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 0' }}>
          No suggestions yet. Enter some ingredients and click Discover.
        </p>
      );
    }
    return (
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {suggestions.map((sug, idx) => (
          <RecipeCard
            key={idx}
            title={sug.title || 'AI Recipe Suggestion'}
            description={
              sug.summary ||
              (Array.isArray(sug.ingredients)
                ? `Ingredients: ${sug.ingredients.join(', ')}`
                : 'AI generated suggestion')
            }
          />
        ))}
      </div>
    );
  };

  const renderGuideChat = () => {
    const assistantTurnPending =
      loading && (chat.length === 0 || chat[chat.length - 1]?.role !== 'assistant');

    return (
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: 'var(--bg-muted)',
          padding: 12,
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        aria-label="AI guidance chat"
      >
        {chat.length === 0 && (
          <div style={{ color: 'var(--text-muted)' }}>
            Ask for step-by-step cooking guidance. You can start with your goal, e.g., “Make a quick vegetarian pasta.”
          </div>
        )}
        {chat.map((turn, i) => (
          <div
            key={i}
            style={{
              alignSelf: turn.role === 'user' ? 'flex-end' : 'flex-start',
              background: turn.role === 'user' ? 'var(--color-primary)' : 'transparent',
              color: turn.role === 'user' ? '#fff' : 'inherit',
              border: turn.role === 'assistant' ? '1px solid var(--border)' : 'none',
              padding: '8px 10px',
              borderRadius: 8,
              maxWidth: '80%',
              whiteSpace: 'pre-wrap',
            }}
          >
            {turn.content}
          </div>
        ))}
        {assistantTurnPending && (
          <div
            style={{
              alignSelf: 'flex-start',
              border: '1px solid var(--border)',
              padding: '8px 10px',
              borderRadius: 8,
              maxWidth: '80%',
              opacity: 0.8,
            }}
          >
            Thinking…
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className="container"
      style={{
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--bg)',
        display: 'grid',
        gap: 16,
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div>
          <h2 className="title" style={{ marginBottom: 4 }}>AI Chef Assistant</h2>
          <p className="subtitle" style={{ margin: 0 }}>
            Discover recipe ideas or get step-by-step guidance powered by AI.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="AI mode selector"
          style={{
            display: 'inline-flex',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <button
            role="tab"
            aria-selected={mode === 'discover'}
            className="btn"
            onClick={() => setMode('discover')}
            style={{
              borderRadius: 0,
              background: mode === 'discover' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'discover' ? '#fff' : 'inherit',
              border: 'none',
            }}
          >
            Discover
          </button>
          <button
            role="tab"
            aria-selected={mode === 'guide'}
            className="btn"
            onClick={() => setMode('guide')}
            style={{
              borderRadius: 0,
              background: mode === 'guide' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'guide' ? '#fff' : 'inherit',
              border: 'none',
              borderLeft: '1px solid var(--border)',
            }}
          >
            Guide me
          </button>
        </div>
      </header>

      <form
        onSubmit={mode === 'discover' ? onRunDiscover : onRunGuide}
        style={{ display: 'grid', gap: 12 }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="ingredients">Ingredients (comma-separated)</label>
          <input
            id="ingredients"
            placeholder="e.g., chicken breast, broccoli, garlic"
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label htmlFor="diet">Diet (optional)</label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
            >
              <option value="">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="dairy-free">Dairy-free</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label htmlFor="excludes">Exclude ingredients (comma-separated)</label>
            <input
              id="excludes"
              placeholder="e.g., peanuts, shellfish"
              value={excludes}
              onChange={(e) => setExcludes(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label htmlFor="servings">Servings (optional)</label>
            <input
              id="servings"
              type="number"
              min={1}
              placeholder="e.g., 2"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label htmlFor="guidance">Guidance level</label>
            <select
              id="guidance"
              value={guidanceLevel}
              onChange={(e) => setGuidanceLevel(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
            >
              <option value="quick">Quick</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>

        {mode === 'guide' && (
          <div style={{ display: 'grid', gap: 8 }}>
            <label htmlFor="guidePrompt">Ask for guidance</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                id="guidePrompt"
                placeholder="e.g., Help me make a fast dinner with these ingredients..."
                value={guidePrompt}
                onChange={(e) => setGuidePrompt(e.target.value)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}
              />
              <button
                type="submit"
                className="btn"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? 'Thinking…' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {mode === 'discover' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn" disabled={loading} aria-disabled={loading}>
              {loading ? 'Finding…' : 'Discover'}
            </button>
            <button type="button" className="btn" onClick={onClear} style={{ background: 'transparent', color: 'inherit' }}>
              Clear
            </button>
          </div>
        )}
      </form>

      {error && (
        <div
          role="alert"
          style={{
            border: '1px solid rgba(220, 38, 38, 0.35)',
            background: 'rgba(220, 38, 38, 0.08)',
            color: '#ef4444',
            padding: 10,
            borderRadius: 8,
          }}
        >
          {error.message || 'Something went wrong fetching AI suggestions.'}
        </div>
      )}

      {mode === 'discover' ? (
        <section aria-live="polite" style={{ display: 'grid', gap: 12 }}>
          {renderDiscoverResults()}
        </section>
      ) : (
        <section style={{ display: 'grid', gap: 12 }}>
          {renderGuideChat()}
          {/* If backend returns suggestions during guide, show optional cards below chat */}
          {Array.isArray(data?.suggestions) && data.suggestions.length > 0 && (
            <div>
              <h3 style={{ margin: '8px 0' }}>Related suggestions</h3>
              <div
                style={{
                  marginTop: 8,
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                }}
              >
                {data.suggestions.map((sug, idx) => (
                  <RecipeCard
                    key={idx}
                    title={sug.title || 'AI Recipe Suggestion'}
                    description={
                      sug.summary ||
                      (Array.isArray(sug.ingredients)
                        ? `Ingredients: ${sug.ingredients.join(', ')}`
                        : 'AI generated suggestion')
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={onClear}>
              Reset
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
