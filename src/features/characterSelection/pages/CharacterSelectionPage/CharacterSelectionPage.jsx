// src/features/characterSelection/pages/CharacterSelectionPage/CharacterSelectionPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CharacterSelection from '../../components/CharacterSelection';
import useGameSelection from '../../../gameSelection/hooks/useGameSelection';
import useCharacterSelection from '../../hooks/useCharacterSelection';
import './CharacterSelectionPage.scss';

const CharacterSelectionPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Get game data from the game selection feature
  const { selectedGame, loadGameById } = useGameSelection();
  
  // Get character data from the character selection feature
  const { resetCharacters } = useCharacterSelection(gameId);

  // Load the game if it's not already selected
  useEffect(() => {
    if (!selectedGame || selectedGame.id !== gameId) {
      loadGameById(gameId);
    }
  }, [gameId, selectedGame, loadGameById]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      resetCharacters();
    };
  }, [resetCharacters]);

  // Redirect to game selection if no game ID
  useEffect(() => {
    if (!gameId) {
      navigate('/games');
    }
  }, [gameId, navigate]);

  console.log('CharacterSelectionPage rendering with gameId:', gameId);
  console.log('Selected game:', selectedGame);

  return (
    <div className="character-selection-page">
      <header className="character-selection-page__header">
        <div className="character-selection-page__back">
          <Link to="/games" className="character-selection-page__back-link">
            ← Back to Games
          </Link>
        </div>
        
        <h1 className="character-selection-page__title">
          {selectedGame ? `${selectedGame.name} Characters` : 'Select Character'}
        </h1>
        
        {selectedGame && (
          <p className="character-selection-page__subtitle">
            Select a character to view and create combos
          </p>
        )}
      </header>
      
      <CharacterSelection />
    </div>
  );
};

export default CharacterSelectionPage;