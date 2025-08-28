import React from 'react';

/**
 * RecipeCard placeholder component.
 * Displays minimal info; replace with real props and layout later.
 */
export default function RecipeCard({ title = 'Recipe Title', description = 'Short description...' }) {
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: 8,
      padding: 12,
      background: 'var(--bg-secondary)'
    }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
}
