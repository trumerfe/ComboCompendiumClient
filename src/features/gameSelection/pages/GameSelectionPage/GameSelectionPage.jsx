// src/features/gameSelection/pages/GameSelectionPage/GameSelectionPage.jsx
import React, { useEffect } from 'react';
import GameSelection from '../../components/GameSelection';
import useGameSelection from '../../hooks/useGameSelection';
import './GameSelectionPage.scss';

const GameSelectionPage = () => {
  const { clearGame } = useGameSelection();
  
  // Clear selected game when landing on this page
  useEffect(() => {
    clearGame();
  }, [clearGame]);

  return (
    <div className="game-selection-page">
      <header className="game-selection-page__header">
        <h1 className="game-selection-page__title">
          <span className="text-gradient">Choose Your Game</span>
        </h1>
        <p className="game-selection-page__subtitle">
          Select a fighting game to view its characters and combos
        </p>
      </header>
      
      <GameSelection />
    </div>
  );
};

export default GameSelectionPage;