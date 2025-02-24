// features/combo-builder/components/ComboCreatorPage/ComboCreatorPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSelectedGame } from '../../../game-selection/store/gameSelectionSlice';
import { selectSelectedCharacter } from '../../../character-selection/store/characterSelectionSlice';
import ComboCreator from '../ComboCreator';
import './ComboCreatorPage.scss';

const ComboCreatorPage = () => {
  const { gameId, characterId } = useParams();
  const selectedGame = useSelector(selectSelectedGame);
  const selectedCharacter = useSelector(selectSelectedCharacter);

  if (!selectedGame || !selectedCharacter) {
    return (
      <div className="combo-creator-page__error">
        <h2>Character not found</h2>
        <p>Please select a game and character first.</p>
      </div>
    );
  }

  return (
    <div className="combo-creator-page">
      <div className="combo-creator-page__header">
        <div className="combo-creator-page__breadcrumbs">
          <span>{selectedGame.name}</span>
          <span> / </span>
          <span>{selectedCharacter.name}</span>
          <span> / </span>
          <span>Create Combo</span>
        </div>
      </div>
      <ComboCreator />
    </div>
  );
};

export default ComboCreatorPage;