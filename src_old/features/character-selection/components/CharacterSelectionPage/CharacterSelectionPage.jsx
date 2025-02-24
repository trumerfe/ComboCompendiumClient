// features/character-selection/components/CharacterSelectionPage/CharacterSelectionPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  selectCharacters, 
  selectCharactersLoading, 
  selectCharactersError
} from '../../store/characterSelectionSlice';
import { selectSelectedGame } from '../../../game-selection/store/gameSelectionSlice';
import { fetchCharacters, selectCharacter } from '../../store/characterSelectionSlice';
import './CharacterSelectionPage.scss';

const CharacterSelectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const selectedGame = useSelector(selectSelectedGame);
  const characters = useSelector(selectCharacters);
  const isLoading = useSelector(selectCharactersLoading);
  const error = useSelector(selectCharactersError);

  useEffect(() => {
    // Always fetch characters when the gameId changes
    dispatch(fetchCharacters(gameId));
  }, [dispatch, gameId]);

  const handleCharacterSelect = (character) => {
    dispatch(selectCharacter(character));
    navigate(`/games/${gameId}/characters/${character.id}/combos`);
  };

  if (isLoading) {
    return <div className="character-selection-page__loading">Loading characters...</div>;
  }

  if (error) {
    return <div className="character-selection-page__error">Error: {error}</div>;
  }

  return (
    <div className="character-selection-page">
      <h1 className="character-selection-page__title">
        {selectedGame ? `${selectedGame.name} - ` : ''}Select a Character
      </h1>
      <div className="character-selection-page__grid">
        {characters.map((character) => (
          <div 
            key={character.id} 
            className="character-selection-page__card"
            onClick={() => handleCharacterSelect(character)}
          >
            <img 
              src={character.imageUrl} 
              alt={character.name} 
              className="character-selection-page__image" 
            />
            <div className="character-selection-page__name">{character.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelectionPage;