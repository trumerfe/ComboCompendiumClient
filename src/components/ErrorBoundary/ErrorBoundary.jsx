import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import './ErrorBoundary.scss';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      <div className="error-fallback__content">
        <h2 className="error-fallback__title">Something went wrong</h2>
        <p className="error-fallback__message">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="error-fallback__details">
          <p className="error-fallback__error-message">{error.message}</p>
        </div>
        <button 
          className="error-fallback__button" 
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const handleError = (error, info) => {
    // In a real app, you would log this to a service like Sentry
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', info.componentStack);
  };

  const handleReset = () => {
    // Any cleanup or state reset logic
    window.location.href = '/'; // Simple reset by going to home
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;