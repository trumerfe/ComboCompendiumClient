// src_new/hooks/useErrorHandler.js
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useErrorHandler = () => {
  const handleError = useCallback((error, options = {}) => {
    console.error('Error:', error);
    
    const {
      title = 'Error',
      fallbackMessage = 'An unexpected error occurred',
      showToast = true,
      logToService = true,
    } = options;
    
    const errorMessage = error.message || fallbackMessage;
    
    if (showToast) {
      toast.error(errorMessage);
    }
    
    if (logToService) {
      // In a real app, you would log this to a service like Sentry
      // logErrorToService(error, { title });
    }
    
    return errorMessage;
  }, []);
  
  return { handleError };
};