import { useEffect } from 'react';
import { toast } from 'react-toastify';
import './ErrorFallback.scss';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  useEffect(() => {
    toast.error('An error occurred! The application will try to recover.');
  }, []);

  return (
    <div className="error-fallback">
      <div className="error-fallback__content">
        <h2 className="error-fallback__title">Something went wrong</h2>
        <pre className="error-fallback__message">{error.message}</pre>
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

export default ErrorFallback;