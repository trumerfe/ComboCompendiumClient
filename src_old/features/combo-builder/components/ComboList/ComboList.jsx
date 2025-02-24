// features/combo-builder/components/ComboList/ComboList.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useComboBuilder } from '../../hooks/useComboBuilder';
import { selectSelectedCharacter } from '../../../character-selection/store/characterSelectionSlice';
import './ComboList.scss';

const ComboList = () => {
  const { combos, isLoading, error, fetchCombos, handleDeleteCombo, navigateToComboCreator } = useComboBuilder();
  // const selectedCharacter = useSelector(selectSelectedCharacter);
  const { gameId, characterId } = useParams();

  const selectedCharacter = useSelector(state => state.gameSelection.selectedCharacter);

  useEffect(() => {
    if (characterId) {
      fetchCombos();
    }
  }, [characterId, fetchCombos]);

  if (isLoading) {
    return (
      <div className="combo-list__loading">
        <p>Loading combos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="combo-list__error">
        <p>Error loading combos: {error}</p>
        <button onClick={fetchCombos} className="combo-list__retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="combo-list">
      <div className="combo-list__header">
        <h2 className="combo-list__title">
          {selectedCharacter?.name}'s Combos
        </h2>
        <button 
          className="combo-list__create-button"
          onClick={navigateToComboCreator}
        >
          Create New Combo
        </button>
      </div>

      {combos.length === 0 ? (
        <div className="combo-list__empty">
          <p>No combos found for this character.</p>
          <p>Click "Create New Combo" to add your first combo!</p>
        </div>
      ) : (
        <div className="combo-list__grid">
          {combos.map(combo => (
            <div key={combo.id} className="combo-list__item">
              <div className="combo-list__item-header">
                <h3 className="combo-list__item-title">{combo.name}</h3>
                <span className="combo-list__item-damage">
                  {combo.damage} damage
                </span>
              </div>
              
              <div className="combo-list__item-sequence">
                {combo.moves.map((move, index) => (
                  <span key={index} className="combo-list__item-move">
                    {move.input}
                    {index < combo.moves.length - 1 && " → "}
                  </span>
                ))}
              </div>
              
              <div className="combo-list__item-actions">
                <button
                  className="combo-list__item-delete"
                  onClick={() => handleDeleteCombo(combo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboList;