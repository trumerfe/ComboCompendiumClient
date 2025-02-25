// src/features/gameSelection/components/GameCard/GameCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './GameCard.scss';

const GameCard = ({ game, onSelect, isSelected }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Format platform display
  const formatPlatform = (platform) => {
    if (Array.isArray(platform)) {
      return platform.join(', ');
    }
    return platform;
  };

  return (
    <div 
      className={`game-card ${isSelected ? 'game-card--selected' : ''}`}
      onClick={() => onSelect(game)}
    >
      <div className="game-card__image-container">
        {!imageError ? (
          <img 
            src={game.imageUrl} 
            alt={game.name} 
            className="game-card__image"
            onError={handleImageError}
          />
        ) : (
          <div className="game-card__image-fallback">
            <span>{game.name.charAt(0)}</span>
          </div>
        )}
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
            {formatPlatform(game.platform)}
          </span>
          <button 
            className="button button--small button--primary game-card__select-button"
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

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    developer: PropTypes.string.isRequired,
    releaseYear: PropTypes.number.isRequired,
    platform: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    description: PropTypes.string
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

GameCard.defaultProps = {
  isSelected: false
};

export default GameCard;