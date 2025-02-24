// src/features/gameSelection/hooks/useCharacterSelection.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  fetchCharacters, 
  selectCharacters, 
  selectSelectedCharacter, 
  selectCharactersStatus, 
  selectCharactersError,
  selectCharacter,
  clearCharacters,
  setError
} from '../store/characterSelectionSlice';
import { selectSelectedGame } from '../../gameSelection/store/gameSelectionSlice';

export const useCharacterSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const characters = useSelector(selectCharacters);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const status = useSelector(selectCharactersStatus);
  const error = useSelector(selectCharactersError);
  const selectedGame = useSelector(selectSelectedGame);

  // Load characters based on the selected game
  useEffect(() => {
    if (selectedGame && characters.length === 0 && status === 'idle') {
      dispatch(fetchCharacters(selectedGame.id));
    }
  }, [selectedGame, characters.length, status, dispatch]);

  // Handle character selection
  const handleSelectCharacter = useCallback((character) => {
    dispatch(selectCharacter(character));
    
    // Navigate to the combo list page for this character
    navigate(`/games/${character.gameId}/characters/${character.id}/combos`);
    
    // Show toast notification
    toast.success(`Selected ${character.name}`);
  }, [dispatch, navigate]);

  // Reload characters
  const reloadCharacters = useCallback(() => {
    if (selectedGame) {
      dispatch(fetchCharacters(selectedGame.id));
    } else {
      toast.error('No game selected');
    }
  }, [selectedGame, dispatch]);

  // Clear characters when component unmounts or when manually triggered
  const handleClearCharacters = useCallback(() => {
    dispatch(clearCharacters());
  }, [dispatch]);

  // Go back to game selection
  const goBackToGameSelection = useCallback(() => {
    navigate('/games');
  }, [navigate]);

  return {
    characters,
    selectedCharacter,
    isLoading: status === 'loading',
    hasError: status === 'failed',
    error,
    selectedGame,
    selectCharacter: handleSelectCharacter,
    reloadCharacters,
    clearCharacters: handleClearCharacters,
    goBackToGameSelection
  };
};

export default useCharacterSelection;