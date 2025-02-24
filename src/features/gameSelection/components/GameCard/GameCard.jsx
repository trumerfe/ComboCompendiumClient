// src/features/gameSelection/components/GameCard/GameCard.jsx
import React from 'react';
import './GameCard.scss';

const GameCard = ({ game, onSelect, isSelected }) => {
  return (
    <div 
      className={`game-card ${isSelected ? 'game-card--selected' : ''}`}
      onClick={() => onSelect(game)}
    >
      <div className="game-card__image-container">
        <img 
          src={game.imageUrl} 
          alt={game.name} 
          className="game-card__image" 
        />
        <div className="game-card__overlay">
          <div className="game-card__badge">
            {game.releaseYear}
          </div>
        </div>
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
        <p className="game-card__subtitle">{game.developer}</p>
        <div className="game-card__footer">
          <span className="game-card__platform">
            {game.platform}
          </span>
          <button 
            className="button button--small button--primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent click event
              onSelect(game);
            }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;