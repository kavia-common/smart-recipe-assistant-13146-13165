import React, { useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import AiPanel from '../features/ai/AiPanel';

/**
 * Home page integrates AI panel for Perplexity-powered discovery and guidance.
 * Shows a search bar, sample cards, and prominently features the AiPanel.
 */
export default function Home() {
  // Placeholder "profile" context to demo AI functionality.
  // In the future, read this from user profile/state.
  const demoProfile = useMemo(
    () => ({
      ingredientsOnHand: ['chicken breast', 'broccoli', 'garlic', 'soy sauce', 'rice'],
      preferences: {
        diet: 'none', // e.g., 'vegetarian', 'vegan'
        excludes: ['peanuts'],
      },
      servings: 2,
    }),
    []
  );

  return (
    <div className="container" style={{ padding: 16, display: 'grid', gap: 16 }}>
      <header>
        <h1 className="title">Discover Recipes</h1>
        <p className="subtitle">Find ideas tailored to your tastes.</p>
      </header>

      {/* Surface AI Panel prominently for demo/testing */}
      <section aria-label="AI assistant section" style={{ marginTop: 4 }}>
        <AiPanel
          /* Props reserved for future extension. The current AiPanel reads its own form state,
             so we expose the intended context here for future wiring if needed. */
          // initialIngredients={demoProfile.ingredientsOnHand}
          // initialDiet={demoProfile.preferences.diet}
          // initialExcludes={demoProfile.preferences.excludes}
          // initialServings={demoProfile.servings}
        />
        <p className="description" style={{ marginTop: 8 }}>
          Tip: Try entering ingredients you have at home like "{demoProfile.ingredientsOnHand.slice(0, 3).join(', ')}".
        </p>
      </section>

      {/* Keep existing discovery flow elements for continuity */}
      <section aria-label="search and samples" style={{ display: 'grid', gap: 12 }}>
        <SearchBar />
        <div
          style={{
            marginTop: 4,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          }}
        >
          <RecipeCard />
          <RecipeCard />
          <RecipeCard />
        </div>
      </section>
    </div>
  );
}
