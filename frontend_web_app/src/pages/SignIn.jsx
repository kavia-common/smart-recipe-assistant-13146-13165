import React from 'react';

/**
 * SignIn page placeholder.
 * Replace with real form and validation later.
 */
export default function SignIn() {
  return (
    <div className="container" style={{ padding: 16, maxWidth: 480 }}>
      <h1 className="title">Sign In</h1>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" type="email" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />
        <input placeholder="Password" type="password" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />
        <button type="submit" className="btn">Sign In</button>
      </form>
    </div>
  );
}
