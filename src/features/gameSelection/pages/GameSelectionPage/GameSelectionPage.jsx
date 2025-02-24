// src/features/gameSelection/pages/GameSelectionPage/GameSelectionPage.jsx
import React from 'react';
import GameSelection from '../../components/GameSelection';
import './GameSelectionPage.scss';

const GameSelectionPage = () => {
  return (
    <div className="page game-selection-page">
      <header className="page__header">
        <h1 className="page__header-title">
          <span className="text-gradient">Choose Your Game</span>
        </h1>
        <p className="page__header-subtitle">
          Select a fighting game to view its characters and combos
        </p>
      </header>
      
      <div className="page__content">
        <GameSelection />
      </div>
    </div>
  );
};

export default GameSelectionPage;