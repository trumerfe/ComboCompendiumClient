// src/features/characterSelection/pages/CharacterSelectionPage/CharacterSelectionPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterSelection from '../../components/CharacterSelection';
import useCharacterSelection from '../../hooks/useCharacterSelection';
import './CharacterSelectionPage.scss';

const CharacterSelectionPage = () => {
  const { selectedGame, goBackToGameSelection } = useCharacterSelection();
  const navigate = useNavigate();
  
  // Redirect to game selection if no game is selected
  useEffect(() => {
    if (!selectedGame) {
      navigate('/games');
    }
  }, [selectedGame, navigate]);

  return (
    <div className="character-selection-page">
      <header className="character-selection-page__header">
        {selectedGame && (
          <>
            <button 
              className="character-selection-page__back-button"
              onClick={goBackToGameSelection}
            >
              Back to Games
            </button>
            <h1 className="character-selection-page__title">
              <span className="text-gradient">{selectedGame.name}</span>
            </h1>
            <p className="character-selection-page__subtitle">
              Select a character to view its combos
            </p>
          </>
        )}
      </header>
      
      <div className="character-selection-page__content">
        <CharacterSelection />
      </div>
    </div>
  );
};

export default CharacterSelectionPage;