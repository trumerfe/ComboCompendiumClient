import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/app/store/appSlice';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = useCallback((error) => {
    dispatch(setLoading(false));
    
    // Handle different types of errors
    if (error.response) {
      // API errors
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          // Handle logout or refresh token
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Network errors
      toast.error('Network error. Please check your connection');
    } else {
      // Other errors
      toast.error(error.message || 'An unexpected error occurred');
    }

    // Log error for debugging
    console.error('Error:', error);
  }, [dispatch]);

  return { handleError };
};