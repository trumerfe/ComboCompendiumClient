// src/features/gameSelection/hooks/useGameSelection.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchGames, 
  fetchGameById,
  selectGame as selectGameAction, 
  clearSelectedGame,
  selectGames, 
  selectSelectedGame, 
  selectGamesStatus, 
  selectGamesError,
  clearError
} from '../store/gameSelectionSlice';
import { clearCharacters } from '../../characterSelection/store/characterSelectionSlice';

/**
 * Custom hook for game selection functionality
 * Provides access to game data and related actions
 */
export const useGameSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select data from Redux store
  const games = useSelector(selectGames);
  const selectedGame = useSelector(selectSelectedGame);
  const status = useSelector(selectGamesStatus);
  const error = useSelector(selectGamesError);
  
  // Load games on mount if not already loaded
  useEffect(() => {
    if (games.length === 0 && status === 'idle') {
      dispatch(fetchGames());
    }
  }, [dispatch, games.length, status]);

  // Select a game and navigate to characters page
  const handleSelectGame = useCallback((game) => {
    console.log('Game selected:', game);
    
    // Clear previous character state before selecting a new game
    dispatch(clearCharacters());
    
    // Set the selected game in Redux
    dispatch(selectGameAction(game));
    
    // Use the correct route path matching your App.jsx
    const path = `/games/${game.id}/characters`;
    console.log('Navigating to:', path);
    navigate(path);
  }, [dispatch, navigate]);

  // Load a specific game by ID
  const loadGameById = useCallback((gameId) => {
    dispatch(fetchGameById(gameId));
  }, [dispatch]);

  // Clear game selection
  const clearGame = useCallback(() => {
    dispatch(clearSelectedGame());
  }, [dispatch]);

  // Reload games (useful for retrying after an error)
  const reloadGames = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchGames());
  }, [dispatch]);

  return {
    // State
    games,
    selectedGame,
    status,
    error,
    isLoading: status === 'loading',
    
    // Actions
    selectGame: handleSelectGame,
    loadGameById,
    clearGame,
    reloadGames
  };
};

// Add this line to maintain backward compatibility with default imports
export default useGameSelection;