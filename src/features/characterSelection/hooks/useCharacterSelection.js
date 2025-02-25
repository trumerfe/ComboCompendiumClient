// src/features/characterSelection/hooks/useCharacterSelection.js
import { useEffect, useCallback } from 'react';
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
 * @param {string} gameId - Optional game ID to load characters for
 */
const useCharacterSelection = (gameId = null) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select data from Redux store
  const characters = useSelector(selectCharacters);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const status = useSelector(selectCharactersStatus);
  const error = useSelector(selectCharactersError);
  const selectedGame = useSelector(selectSelectedGame);
  
  // Load characters for the specified game ID or from the selected game in state
  useEffect(() => {
    const targetGameId = gameId || (selectedGame && selectedGame.id);
    
    if (targetGameId && characters.length === 0 && status === 'idle') {
      dispatch(fetchCharactersByGameId(targetGameId));
    }
  }, [dispatch, gameId, selectedGame, characters.length, status]);

  // Select a character and navigate to combos page
  const handleSelectCharacter = useCallback((character) => {
    dispatch(selectCharacter(character));
    
    // Navigate to the character's combo page
    const targetGameId = gameId || (selectedGame && selectedGame.id);
    if (targetGameId) {
      navigate(`/games/${targetGameId}/characters/${character.id}/combos`);
    }
  }, [dispatch, navigate, gameId, selectedGame]);

  // Load a specific character by ID
  const loadCharacterById = useCallback((characterId) => {
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

  // Load characters for a specific game (useful when changing games)
  const loadCharactersForGame = useCallback((targetGameId) => {
    if (targetGameId) {
      dispatch(clearCharacters());
      dispatch(fetchCharactersByGameId(targetGameId));
    }
  }, [dispatch]);

  // Reload characters (useful for retrying after an error)
  const reloadCharacters = useCallback(() => {
    const targetGameId = gameId || (selectedGame && selectedGame.id);
    if (targetGameId) {
      dispatch(clearError());
      dispatch(fetchCharactersByGameId(targetGameId));
    }
  }, [dispatch, gameId, selectedGame]);

  return {
    // State
    characters,
    selectedCharacter,
    status,
    error,
    isLoading: status === 'loading',
    
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