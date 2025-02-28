// src/components/Navbar/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  // This will be replaced with real auth state when implemented
  const isAuthenticated = false;
  
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo" onClick={handleLogoClick}>
          {/* Placeholder logo - replace with actual logo when available */}
          <div className="navbar__logo-placeholder">CC</div>
        </div>
        <h1 className="navbar__title">Combo Compendium</h1>
      </div>
      
      <div className="navbar__actions">
        {isAuthenticated ? (
          <>
            <button className="button button--glass navbar__button">
              <span className="button__icon">⚙️</span>
              Settings
            </button>
            <button className="button button--primary navbar__button">
              Logout
            </button>
          </>
        ) : (
          <button className="button button--primary navbar__button">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;