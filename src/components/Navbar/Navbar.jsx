import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.scss";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  
  // Add error handling for useAuth
  let authData = { userLoggedIn: false, user: null };
  try {
    authData = useAuth() || { userLoggedIn: false, user: null };
  } catch (error) {
    console.error("Error using auth context:", error);
  }
  
  const { userLoggedIn, currentUser } = authData;

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo">
            {/* Placeholder logo - SVG version */}
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="var(--color-primary)" />
              <path 
                d="M10 20L15 14L20 20L25 14L30 20" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M10 26L15 20L20 26L25 20L30 26" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
          <span className="navbar__title">Combo Compendium</span>
        </Link>
        
        <div className="navbar__actions">
          {userLoggedIn ? (
            <>
              <span className="navbar__user-email">{currentUser?.email}</span>
              <button 
                onClick={handleSignOut} 
                className="navbar__button navbar__button--secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="navbar__button navbar__button--secondary" to="/login">
                Login
              </Link>
              <Link className="navbar__button navbar__button--primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;