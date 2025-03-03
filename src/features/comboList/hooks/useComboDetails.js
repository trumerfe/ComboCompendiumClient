// src/features/comboList/hooks/useComboDetails.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getComboById } from '../../../services/apiService';
import { expandComboNotation } from '../../../services/notationService';
import { setError } from '../store/comboListSlice';

/**
 * Hook for fetching and managing combo details with expanded notation
 * @param {string} comboId - The ID of the combo to fetch
 * @returns {Object} - Combo details, loading state, error state, and expanded notation
 */
const useComboDetails = (comboId) => {
  const dispatch = useDispatch();
  const [combo, setCombo] = useState(null);
  const [expandedNotation, setExpandedNotation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNumpad, setShowNumpad] = useState(false);
  
  // Fetch combo data and expand notation
  useEffect(() => {
    const fetchComboDetails = async () => {
      if (!comboId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch combo data
        const response = await getComboById(comboId);
        
        if (!response || !response.success || !response.data) {
          throw new Error('Failed to fetch combo data');
        }
        
        const comboData = response.data;
        setCombo(comboData);
        
        // Expand notation
        const expanded = await expandComboNotation(comboData);
        setExpandedNotation(expanded);
      } catch (err) {
        console.error('Error fetching combo details:', err);
        setError(err.message || 'Failed to fetch combo details');
        dispatch(setError(err.message || 'Failed to fetch combo details'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchComboDetails();
  }, [comboId, dispatch]);
  
  // Toggle numpad display
  const toggleNumpad = () => {
    setShowNumpad(prev => !prev);
  };
  
  return {
    combo,
    expandedNotation,
    loading,
    error,
    showNumpad,
    toggleNumpad
  };
};

export default useComboDetails;