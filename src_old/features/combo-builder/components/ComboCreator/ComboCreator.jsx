// features/combo-builder/components/ComboCreator/ComboCreator.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useComboBuilder } from '../../hooks/useComboBuilder';
import { selectSelectedCharacter } from '../../../character-selection/store/characterSelectionSlice';
import MoveList from '../MoveList';
import ComboSequence from '../ComboSequence';
import './ComboCreator.scss';

const ComboCreator = () => {
  const { 
    currentCombo, 
    availableMoves, 
    isLoading, 
    error, 
    fetchAvailableMoves,
    handleAddMove,
    handleRemoveMove,
    handleReorderMoves,
    saveCombo,
    navigateToComboList
  } = useComboBuilder();
  
  const [comboName, setComboName] = useState('');
  const selectedCharacter = useSelector(selectSelectedCharacter);

  useEffect(() => {
    fetchAvailableMoves();
  }, [fetchAvailableMoves]);

  // Calculate total damage
  const totalDamage = currentCombo.reduce((total, move) => total + move.damage, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCombo(comboName);
  };

  if (isLoading) {
    return (
      <div className="combo-creator__loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="combo-creator__error">
        <p>Error: {error}</p>
        <button onClick={fetchAvailableMoves} className="combo-creator__retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="combo-creator">
      <div className="combo-creator__header">
        <h2 className="combo-creator__title">
          Create Combo for {selectedCharacter?.name}
        </h2>
        <button 
          className="combo-creator__cancel-button"
          onClick={navigateToComboList}
        >
          Cancel
        </button>
      </div>

      <div className="combo-creator__content">
        <div className="combo-creator__move-list-container">
          <h3 className="combo-creator__subtitle">Available Moves</h3>
          <MoveList 
            moves={availableMoves} 
            onMoveSelect={handleAddMove} 
          />
        </div>

        <div className="combo-creator__sequence-container">
          <h3 className="combo-creator__subtitle">
            Combo Sequence
            {totalDamage > 0 && (
              <span className="combo-creator__damage-counter">
                Total Damage: {totalDamage}
              </span>
            )}
          </h3>
          <ComboSequence 
            moves={currentCombo} 
            onMoveRemove={handleRemoveMove}
            onReorder={handleReorderMoves}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="combo-creator__form">
        <div className="combo-creator__form-group">
          <label htmlFor="combo-name" className="combo-creator__label">
            Combo Name
          </label>
          <input
            id="combo-name"
            type="text"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            required
            className="combo-creator__input"
            placeholder="Enter a name for your combo"
          />
        </div>
        <div className="combo-creator__form-actions">
          <button
            type="button"
            onClick={navigateToComboList}
            className="combo-creator__button combo-creator__button--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={currentCombo.length === 0 || !comboName}
            className="combo-creator__button combo-creator__button--primary"
          >
            Save Combo
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComboCreator;