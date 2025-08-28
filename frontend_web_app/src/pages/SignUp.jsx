import React from 'react';

/**
 * SignUp page placeholder.
 * Replace with real form and validation later.
 */
export default function SignUp() {
  return (
    <div className="container" style={{ padding: 16, maxWidth: 480 }}>
      <h1 className="title">Create Account</h1>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Name" type="text" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />
        <input placeholder="Email" type="email" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />
        <input placeholder="Password" type="password" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />
        <button type="submit" className="btn">Sign Up</button>
      </form>
    </div>
  );
}
