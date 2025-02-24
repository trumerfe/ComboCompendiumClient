// src/features/gameSelection/components/GameSelection/GameSelection.jsx
import React from 'react';
import GameCard from '../GameCard';
import { useGameSelection } from '../../hooks/useGameSelection';
import './GameSelection.scss';

const GameSelection = () => {
  const { 
    games, 
    selectedGame, 
    isLoading, 
    error, 
    selectGame, 
    refreshGames 
  } = useGameSelection();

  // Loading state
  if (isLoading && games.length === 0) {
    return (
      <div className="game-selection__loading">
        <div className="game-selection__loading-spinner"></div>
        <p>Loading games...</p>
      </div>
    );
  }

  // Error state
  if (error && games.length === 0) {
    return (
      <div className="game-selection__error">
        <p>{error}</p>
        <button 
          className="button button--primary mt-4"
          onClick={refreshGames}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && games.length === 0) {
    return (
      <div className="game-selection__empty">
        <p>No games found.</p>
        <button 
          className="button button--primary mt-4"
          onClick={refreshGames}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="game-selection">
      <div className="game-selection__grid">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onSelect={selectGame}
            isSelected={selectedGame && selectedGame.id === game.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GameSelection;