// src/features/characterSelection/components/CharacterCard/CharacterCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CharacterCard.scss';

const CharacterCard = ({ character, onSelect, isSelected }) => {
  // Use state to track if we're using the placeholder
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  
  // Handle image error just once
  const handleImageError = (e) => {
    // Only replace with placeholder if we haven't already
    if (!usePlaceholder) {
      setUsePlaceholder(true);
      e.target.src = '/placeholder-character.jpg';
    }
  };

  return (
    <div 
      className={`character-card ${isSelected ? 'character-card--selected' : ''}`}
      onClick={() => onSelect(character)}
    >
      <div className="character-card__image-container">
        <img 
          src={usePlaceholder ? '/placeholder-character.jpg' : character.imageUrl} 
          alt={character.name} 
          className="character-card__image" 
          onError={handleImageError}
        />
        <div className="character-card__overlay">
          <div className="character-card__difficulty" data-difficulty={character.difficulty.toLowerCase()}>
            {character.difficulty}
          </div>
        </div>
      </div>
      <div className="character-card__content">
        <h3 className="character-card__name">{character.name}</h3>
      </div>
    </div>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    difficulty: PropTypes.string.isRequired,
    archetype: PropTypes.string.isRequired
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

CharacterCard.defaultProps = {
  isSelected: false
};

export default CharacterCard;