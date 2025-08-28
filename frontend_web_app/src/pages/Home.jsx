import React from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

/**
 * Home page placeholder.
 * Lists example recipe cards and includes a search bar.
 */
export default function Home() {
  return (
    <div className="container" style={{ padding: 16 }}>
      <h1 className="title">Discover Recipes</h1>
      <p className="subtitle">Find ideas tailored to your tastes.</p>
      <SearchBar />
      <div style={{ marginTop: 16, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
    </div>
  );
}
