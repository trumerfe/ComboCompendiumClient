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
      // If you don't have this placeholder image, you can use a data URL instead:
      // e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzM0NDk1RSIvPjx0ZXh0IHg9IjgwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
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
        <span className="character-card__archetype">{character.archetype}</span>
      </div>
    </div>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    gameId: PropTypes.number.isRequired,
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