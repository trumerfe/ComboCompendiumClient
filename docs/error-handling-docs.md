# Error Handling Guide

## Overview
This document outlines our comprehensive error handling strategy, including error boundaries, toast notifications, and error handling patterns.

## Global Error Boundary

### Setup
The application uses React Error Boundary for catching and handling React component errors:

```javascript
// components/ErrorBoundary/ErrorFallback.jsx
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-fallback">
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

// App.jsx
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorBoundary/ErrorFallback';

const App = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // Reset application state
    }}
    onError={(error) => {
      console.error('Error caught by boundary:', error);
      // Log error to monitoring service
    }}
  >
    <AppContent />
  </ErrorBoundary>
);
```

## Toast Notifications

### Configuration
Using React Toastify for user-friendly error messages:

```javascript
// App.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <>
    <AppContent />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </>
);
```

### Usage
```javascript
import { toast } from 'react-toastify';

// Success notification
toast.success('Operation completed successfully');

// Error notification
toast.error('An error occurred');

// Warning notification
toast.warning('Please check your input');

// Info notification
toast.info('Update available');
```

## Error Handler Hook

### Implementation
```javascript
// hooks/useErrorHandler.js
import { toast } from 'react-toastify';

export const useErrorHandler = () => {
  const handleError = (error) => {
    console.error('Error:', error);
    
    // Determine error type and show appropriate message
    if (error.name === 'NetworkError') {
      toast.error('Network error. Please check your connection.');
    } else if (error.name === 'ValidationError') {
      toast.warning(error.message);
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return { handleError };
};
```

### Usage
```javascript
const MyComponent = () => {
  const { handleError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      await submitData();
    } catch (error) {
      handleError(error);
    }
  };
};
```

## API Error Handling

### Axios Interceptor
```javascript
// utils/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: '/api'
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Please login to continue');
          // Handle unauthorized
          break;
        case 403:
          toast.error('You don\'t have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);
```

## Component-Level Error Handling

### Error States in Components
```javascript
const GameSelection = () => {
  const [error, setError] = useState(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await fetchGames();
        dispatch(setGames(games));
      } catch (error) {
        setError(error);
        handleError(error);
      }
    };

    loadGames();
  }, []);

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  return <GameList games={games} />;
};
```

### Error Display Component
```javascript
// components/ErrorDisplay/ErrorDisplay.jsx
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="error-display">
    <h3>Error</h3>
    <p>{error.message}</p>
    {onRetry && (
      <button onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);
```

## Form Error Handling

### Form Validation
```javascript
const ComboForm = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (values.moves.length === 0) {
      errors.moves = 'At least one move is required';
    }
    
    return errors;
  };

  const handleSubmit = (values) => {
    const formErrors = validateForm(values);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Submit form
  };
};
```

## Best Practices

1. **Use Error Boundaries**
   - Place error boundaries strategically
   - Provide meaningful fallback UIs
   - Handle reset logic properly

2. **Toast Notifications**
   - Keep messages clear and concise
   - Use appropriate types (error, warning, info)
   - Set reasonable timeouts

3. **API Errors**
   - Handle common HTTP status codes
   - Provide user-friendly messages
   - Include retry mechanisms where appropriate

4. **Component Errors**
   - Handle loading and error states
   - Provide retry options
   - Show appropriate fallback content

5. **Form Validation**
   - Validate on submit and blur
   - Show clear error messages
   - Handle async validation properly