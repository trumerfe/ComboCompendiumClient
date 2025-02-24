// src/features/characterSelection/components/CharacterSelection/CharacterSelection.jsx
import React from 'react';
import CharacterCard from '../CharacterCard';
import useCharacterSelection from '../../hooks/useCharacterSelection';
import './CharacterSelection.scss';

const CharacterSelection = () => {
  const {
    characters,
    selectedCharacter,
    isLoading,
    hasError,
    error,
    selectCharacter,
    reloadCharacters,
    selectedGame,
  } = useCharacterSelection();

  // Loading state
  if (isLoading) {
    return (
      <div className="character-selection__loading">
        <div className="character-selection__spinner"></div>
        <p>Loading characters...</p>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="character-selection__error">
        <h3>Error Loading Characters</h3>
        <p>{error}</p>
        <button 
          className="button button--primary"
          onClick={reloadCharacters}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No game selected state
  if (!selectedGame) {
    return (
      <div className="character-selection__no-game">
        <h3>No Game Selected</h3>
        <p>Please select a game first to view its characters</p>
      </div>
    );
  }

  // Empty state
  if (characters.length === 0) {
    return (
      <div className="character-selection__empty">
        <h3>No Characters Found</h3>
        <p>No characters are available for {selectedGame.name}</p>
      </div>
    );
  }

  return (
    <div className="character-selection">
      <div className="character-selection__filters">
        {/* Filter options could go here in the future */}
      </div>

      <div className="character-selection__grid">
        {characters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={selectCharacter}
            isSelected={selectedCharacter?.id === character.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;