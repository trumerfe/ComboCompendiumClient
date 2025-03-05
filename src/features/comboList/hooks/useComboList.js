import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/authContext';
import { 
  fetchCombosByCharacterId,
  clearCombos,
  selectCombos,
  selectComboListStatus,
  selectComboListError,
  selectFilters
} from '../store/comboListSlice';
import { selectSelectedCharacter } from '../../characterSelection/store/characterSelectionSlice';
import { selectSelectedGame } from '../../gameSelection/store/gameSelectionSlice';

/**
 * Custom hook for managing combo list functionality
 * @param {string} characterId - Character ID to fetch combos for (optional, will use selected character from state if not provided)
 * @returns {Object} Combo list state and functions
 */
export const useComboList = (characterId, gameId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  
  // Get state from Redux
  const combos = useSelector(selectCombos);
  const status = useSelector(selectComboListStatus);
  const error = useSelector(selectComboListError);
  const filters = useSelector(selectFilters);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const selectedGame = useSelector(selectSelectedGame);
  
  // Use provided characterId or fall back to selected character from state
  const targetCharacterId = characterId || selectedCharacter?.id;
  
  // Function to navigate to combo creation page, with auth check
  const navigateToComboCreation = useCallback(() => {
    console.log('navigateToComboCreation called with:', {
      userLoggedIn,
      selectedGame,
      selectedCharacter,
      characterId, // URL parameter
    });
    
    // Get the actual IDs we'll use for navigation, prioritizing URL params
    // if Redux state is not available
    const effectiveGameId = selectedGame?.id || gameId;
    const effectiveCharId = selectedCharacter?.id || characterId;
    
    console.log('Effective IDs for navigation:', {
      effectiveGameId,
      effectiveCharId
    });
    
    if (!userLoggedIn) {
      toast.info('Please log in to create combos');
      
      if (effectiveGameId && effectiveCharId) {
        navigate('/login', { 
          state: { from: `/games/${effectiveGameId}/characters/${effectiveCharId}/builder` } 
        });
      } else {
        navigate('/login');
      }
      return;
    }
    
    // Additional validation to prevent navigation with missing data
    if (!effectiveGameId || !effectiveCharId) {
      console.error('Cannot navigate: Missing game or character data', {
        effectiveGameId,
        effectiveCharId,
        selectedGame,
        selectedCharacter,
        gameId,
        characterId
      });
      toast.error('Missing game or character data. Please try again.');
      return;
    }
    
    // Log the target URL before navigating
    const targetUrl = `/games/${effectiveGameId}/characters/${effectiveCharId}/builder`;
    console.log('Navigating to:', targetUrl);
    
    // Execute the navigation
    navigate(targetUrl);
  }, [navigate, selectedGame, selectedCharacter, gameId, characterId, userLoggedIn]);
  
  // Function to load combos
  const loadCombos = useCallback(() => {
    if (targetCharacterId) {
      dispatch(fetchCombosByCharacterId(targetCharacterId))
        .unwrap()
        .catch(err => {
          console.error('Error loading combos:', err);
          toast.error('Failed to load combos: ' + (err.message || err));
        });
    }
  }, [dispatch, targetCharacterId]);
  
  // Function to clear combo list
  const clearComboList = useCallback(() => {
    dispatch(clearCombos());
  }, [dispatch]);
  
  // Function to navigate back to character selection
  const navigateToCharacterSelection = useCallback(() => {
    if (selectedGame) {
      navigate(`/games/${selectedGame.id}/characters`);
    } else {
      navigate('/games');
    }
  }, [navigate, selectedGame]);
  
  // Load combos on mount or when character ID changes
  useEffect(() => {
    if (targetCharacterId) {
      loadCombos();
    }
    
    // Clean up on unmount
    return () => {
      clearComboList();
    };
  }, [targetCharacterId, loadCombos, clearComboList]);
  
  // Return state and functions
  return {
    combos,
    status,
    error,
    filters,
    selectedCharacter,
    selectedGame,
    loadCombos,
    clearComboList,
    navigateToComboCreation,
    navigateToCharacterSelection
  };
};

export default useComboList;