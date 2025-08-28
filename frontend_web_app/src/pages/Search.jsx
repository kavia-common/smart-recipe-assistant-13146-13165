import React from 'react';
import SearchBar from '../components/SearchBar';

/**
 * Search page placeholder.
 * Will display search results in the future.
 */
export default function Search() {
  return (
    <div className="container" style={{ padding: 16 }}>
      <h1 className="title">Search Recipes</h1>
      <SearchBar />
      <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Search results will appear here.</p>
    </div>
  );
}
