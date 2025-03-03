import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!userLoggedIn) {
    // Store the intended destination to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Render the protected content
  return children;
};

export default ProtectedRoute;