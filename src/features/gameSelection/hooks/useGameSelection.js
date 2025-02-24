// src/features/gameSelection/hooks/useGameSelection.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  selectGames, 
  selectSelectedGame, 
  selectGamesStatus, 
  selectGamesError,
  selectGame,
  fetchGames,
  setError
} from '../store/gameSelectionSlice';
import { clearCharacters } from '../../characterSelection/store/characterSelectionSlice';

export const useGameSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const games = useSelector(selectGames);
  const selectedGame = useSelector(selectSelectedGame);
  const status = useSelector(selectGamesStatus);
  const error = useSelector(selectGamesError);

  // Load games on component mount if they're not already loaded
  useEffect(() => {
    if (games.length === 0 && status === 'idle') {
      dispatch(fetchGames());
    }
  }, [games.length, status, dispatch]);

  // Handle game selection
  const handleSelectGame = useCallback((game) => {
    // First clear any existing character selection data
    dispatch(clearCharacters());
    
    // Then set the selected game
    dispatch(selectGame(game));
    
    // Navigate to the character selection page
    navigate(`/games/${game.id}/characters`);
    
    // Show toast notification
    toast.success(`Selected ${game.name}`);
  }, [dispatch, navigate]);

  // Reload games
  const reloadGames = useCallback(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  return {
    games,
    selectedGame,
    isLoading: status === 'loading',
    hasError: status === 'failed',
    error,
    selectGame: handleSelectGame,
    reloadGames
  };
};

export default useGameSelection;