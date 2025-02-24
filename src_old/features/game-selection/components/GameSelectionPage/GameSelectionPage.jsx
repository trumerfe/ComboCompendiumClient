// features/game-selection/components/GameSelectionPage/GameSelectionPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectGames, selectGamesLoading, selectGamesError } from '../../store/gameSelectionSlice';
import { fetchGames, selectGame } from '../../store/gameSelectionSlice';
import { clearCharacters } from '../../../character-selection/store/characterSelectionSlice';
import './GameSelectionPage.scss';

const GameSelectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const games = useSelector(selectGames);
  const isLoading = useSelector(selectGamesLoading);
  const error = useSelector(selectGamesError);

  useEffect(() => {
    // Load games if they haven't been loaded yet
    if (games.length === 0 && !isLoading) {
      dispatch(fetchGames());
    }
  }, [dispatch, games, isLoading]);

  const handleGameSelect = (game) => {
    dispatch(selectGame(game));
    // Clear previously loaded characters when selecting a new game
    dispatch(clearCharacters()); 
    navigate(`/games/${game.id}/characters`);
  };

  if (isLoading) {
    return <div className="game-selection-page__loading">Loading games...</div>;
  }

  if (error) {
    return <div className="game-selection-page__error">Error: {error}</div>;
  }

  return (
    <div className="game-selection-page">
      <h1 className="game-selection-page__title">Select a Game</h1>
      <div className="game-selection-page__grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-selection-page__card"
            onClick={() => handleGameSelect(game)}
          >
            <img 
              src={game.imageUrl} 
              alt={game.name} 
              className="game-selection-page__image" 
            />
            <div className="game-selection-page__name">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelectionPage;