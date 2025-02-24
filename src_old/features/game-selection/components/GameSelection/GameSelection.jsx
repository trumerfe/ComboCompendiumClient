// src/features/game-selection/components/GameSelection/GameSelection.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectGames,
  selectSelectedGame,
  selectGamesLoading,
  selectGamesError,
  fetchGames,
  selectGame,
} from "../../store/gameSelectionSlice";
import "./GameSelection.scss";

const GameSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const games = useSelector(selectGames);
  const selectedGame = useSelector(selectSelectedGame);
  const isLoading = useSelector(selectGamesLoading);
  const error = useSelector(selectGamesError);

  // Load games when component mounts
  useEffect(() => {
    if (games.length === 0 && !isLoading) {
      dispatch(fetchGames());
    }
  }, [dispatch, games.length, isLoading]);

  const handleGameSelect = (game) => {
    dispatch(selectGame(game));
    // Navigate to character selection page for this game
    navigate(`/games/${game.id}/characters`);
  };

  if (isLoading) {
    return <div className="game-selection__loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="game-selection__error">
        <p>Error loading games: {error}</p>
        <button onClick={() => dispatch(fetchGames())}>Retry</button>
      </div>
    );
  }

  return (
    <div className="game-selection">
      <div className="game-selection__games">
        <h2 className="game-selection__title">Select a Game</h2>
        <div className="game-selection__grid">
          {games && games.length > 0 ? (
            games.map((game) => (
              <div
                key={game.id}
                className={`game-selection__card ${
                  selectedGame?.id === game.id
                    ? "game-selection__card--selected"
                    : ""
                }`}
                onClick={() => handleGameSelect(game)}
              >
                <h3 className="game-selection__card-title">{game.name}</h3>
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="game-selection__card-image"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No games available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
