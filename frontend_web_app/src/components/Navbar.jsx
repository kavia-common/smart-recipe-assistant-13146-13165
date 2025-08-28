import { Link } from 'react-router-dom';

/**
 * Navbar component placeholder with basic navigation links.
 * This is a skeleton component; replace with real design and logic later.
 */
export default function Navbar() {
  return (
    <nav className="navbar" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>SmartRecipe</Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/search">Search</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
