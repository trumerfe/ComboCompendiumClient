// src/features/gameSelection/components/GameSelection/GameSelection.jsx
import React from 'react';
import GameCard from '../GameCard';
import useGameSelection from '../../hooks/useGameSelection';
import './GameSelection.scss';

const GameSelection = () => {
  const { 
    games, 
    selectedGame, 
    status, 
    error, 
    selectGame, 
    reloadGames 
  } = useGameSelection();

  // Calculate derived state
  const isLoading = status === 'loading';
  const hasError = status === 'failed';

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
  if (hasError && games.length === 0) {
    return (
      <div className="game-selection__error">
        <h3>Error Loading Games</h3>
        <p>{error}</p>
        <button 
          className="button button--primary mt-4"
          onClick={reloadGames}
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
        <h3>No Games Found</h3>
        <p>No games are available.</p>
        <button 
          className="button button--primary mt-4"
          onClick={reloadGames}
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