import React from 'react';

/**
 * SearchBar placeholder component.
 * OnSubmit and value management to be implemented later.
 */
export default function SearchBar() {
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
      <input
        placeholder="Search recipes, ingredients..."
        aria-label="Search recipes"
        style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }}
      />
      <button type="submit" className="btn">Search</button>
    </form>
  );
}
