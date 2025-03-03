import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchCharactersByGameId, 
  fetchCharacterById,
  selectCharacter, 
  clearSelectedCharacter,
  clearCharacters,
  selectCharacters, 
  selectSelectedCharacter, 
  selectCharactersStatus, 
  selectCharactersError,
  clearError
} from '../store/characterSelectionSlice';
import { selectSelectedGame } from '../../gameSelection/store/gameSelectionSlice';

/**
 * Custom hook for character selection functionality
 * Provides access to character data and related actions
 * 
 * @param {string} [gameId=null] - Optional game ID to load characters for
 * @returns {Object} Character selection state and actions
 */
const useCharacterSelection = (gameId = null) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select data from Redux store with memoized selectors
  const characters = useSelector(selectCharacters);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const status = useSelector(selectCharactersStatus);
  const error = useSelector(selectCharactersError);
  const selectedGame = useSelector(selectSelectedGame);
  
  // Determine the target game ID with memoization
  const targetGameId = useMemo(() => {
    return gameId || (selectedGame && selectedGame.id) || null;
  }, [gameId, selectedGame]);

  // Load characters for the specified game ID
  useEffect(() => {
    // Additional logging for debugging
    console.log('Character Selection Hook - Loading Characters', {
      targetGameId,
      charactersLength: characters.length,
      status
    });

    // Only fetch if we have a valid game ID and no characters are loaded
    if (targetGameId && characters.length === 0 && status === 'idle') {
      dispatch(fetchCharactersByGameId(targetGameId));
    }
  }, [dispatch, targetGameId, characters.length, status]);

  // Select a character and navigate to combos page
  const handleSelectCharacter = useCallback((character) => {
    // Validate character input
    if (!character || !character.id) {
      console.error('Invalid character selected:', character);
      return;
    }

    dispatch(selectCharacter(character));
    
    // Navigate to the character's combo page
    if (targetGameId) {
      const comboPath = `/games/${targetGameId}/characters/${character.id}/combos`;
      console.log('Navigating to character combos:', comboPath);
      navigate(comboPath);
    } else {
      console.warn('Cannot navigate - no game ID available');
    }
  }, [dispatch, navigate, targetGameId]);

  // Load a specific character by ID
  const loadCharacterById = useCallback((characterId) => {
    if (!characterId) {
      console.warn('Attempted to load character with no ID');
      return;
    }
    dispatch(fetchCharacterById(characterId));
  }, [dispatch]);

  // Clear character selection
  const clearCharacter = useCallback(() => {
    dispatch(clearSelectedCharacter());
  }, [dispatch]);

  // Clear all character data
  const resetCharacters = useCallback(() => {
    dispatch(clearCharacters());
  }, [dispatch]);

  // Load characters for a specific game
  const loadCharactersForGame = useCallback((newGameId) => {
    if (!newGameId) {
      console.warn('Attempted to load characters with no game ID');
      return;
    }

    dispatch(clearCharacters());
    dispatch(fetchCharactersByGameId(newGameId));
  }, [dispatch]);

  // Reload characters (useful for retrying after an error)
  const reloadCharacters = useCallback(() => {
    if (!targetGameId) {
      console.warn('Cannot reload characters - no game ID available');
      return;
    }

    dispatch(clearError());
    dispatch(fetchCharactersByGameId(targetGameId));
  }, [dispatch, targetGameId]);

  // Compute derived states
  const isLoading = status === 'loading';
  const hasError = status === 'failed';

  return {
    // State
    characters,
    selectedCharacter,
    status,
    error,
    isLoading,
    hasError,
    
    // Actions
    selectCharacter: handleSelectCharacter,
    loadCharacterById,
    clearCharacter,
    resetCharacters,
    loadCharactersForGame,
    reloadCharacters
  };
};

export default useCharacterSelection;