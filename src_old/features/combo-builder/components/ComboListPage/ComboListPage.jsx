// features/combo-builder/components/ComboListPage/ComboListPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSelectedGame } from '../../../game-selection/store/gameSelectionSlice';
import { selectSelectedCharacter } from '../../../character-selection/store/characterSelectionSlice';
import ComboList from '../ComboList';
import './ComboListPage.scss';

const ComboListPage = () => {
  const { gameId, characterId } = useParams();
  const selectedGame = useSelector(selectSelectedGame);
  const selectedCharacter = useSelector(selectSelectedCharacter);

  if (!selectedGame || !selectedCharacter) {
    return (
      <div className="combo-list-page__error">
        <h2>Character not found</h2>
        <p>Please select a game and character first.</p>
      </div>
    );
  }

  return (
    <div className="combo-list-page">
      <div className="combo-list-page__header">
        <div className="combo-list-page__breadcrumbs">
          <span>{selectedGame.name}</span>
          <span> / </span>
          <span>{selectedCharacter.name}</span>
          <span> / </span>
          <span>Combos</span>
        </div>
      </div>
      <ComboList />
    </div>
  );
};

export default ComboListPage;