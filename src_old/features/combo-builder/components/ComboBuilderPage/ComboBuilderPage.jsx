// features/combo-builder/components/ComboBuilderPage/ComboBuilderPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  selectCombos, 
  selectCombosLoading, 
  selectCombosError,
  fetchCombos,
  saveCombo,
  deleteCombo
} from '../../store/comboBuilderSlice';
import './ComboBuilderPage.scss';

const ComboBuilderPage = () => {
  const dispatch = useDispatch();
  const { gameId, characterId } = useParams();
  const combos = useSelector(selectCombos);
  const isLoading = useSelector(selectCombosLoading);
  const error = useSelector(selectCombosError);
  
  const [currentCombo, setCurrentCombo] = useState([]);
  const [comboName, setComboName] = useState('');
  const [availableMoves, setAvailableMoves] = useState([
    { id: 1, name: 'LP', type: 'normal' },
    { id: 2, name: 'MP', type: 'normal' },
    { id: 3, name: 'HP', type: 'normal' },
    { id: 4, name: 'LK', type: 'normal' },
    { id: 5, name: 'MK', type: 'normal' },
    { id: 6, name: 'HK', type: 'normal' },
    { id: 7, name: 'QCF+P', type: 'special' },
    { id: 8, name: 'QCB+K', type: 'special' },
    { id: 9, name: 'DP+P', type: 'special' },
    { id: 10, name: 'Super', type: 'super' },
  ]);

  useEffect(() => {
    dispatch(fetchCombos({ gameId, characterId }));
  }, [dispatch, gameId, characterId]);

  const handleAddMove = (move) => {
    setCurrentCombo([...currentCombo, move]);
  };

  const handleRemoveMove = (index) => {
    const newCombo = [...currentCombo];
    newCombo.splice(index, 1);
    setCurrentCombo(newCombo);
  };

  const handleSaveCombo = () => {
    if (currentCombo.length === 0) return;
    
    const newCombo = {
      id: Date.now().toString(),
      name: comboName || `Combo ${combos.length + 1}`,
      moves: currentCombo,
      damage: Math.floor(Math.random() * 50) + 50, // Just for demo
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] // Just for demo
    };
    
    dispatch(saveCombo(newCombo));
    setCurrentCombo([]);
    setComboName('');
  };

  const handleDeleteCombo = (id) => {
    dispatch(deleteCombo(id));
  };

  if (isLoading) {
    return <div className="combo-builder-page__loading">Loading combo data...</div>;
  }

  if (error) {
    return <div className="combo-builder-page__error">Error: {error}</div>;
  }

  return (
    <div className="combo-builder-page">
      <h1 className="combo-builder-page__title">Combo Builder</h1>
      
      {/* Combo Building Workspace */}
      <div className="combo-builder-page__section">
        <h2 className="combo-builder-page__section-title">Build Your Combo</h2>
        
        <div className="combo-builder-page__workspace">
          {currentCombo.length > 0 ? (
            <>
              <div className="combo-builder-page__combo-sequence">
                {currentCombo.map((move, index) => (
                  <div 
                    key={index} 
                    className={`combo-builder-page__move combo-builder-page__move--${move.type}`}
                    onClick={() => handleRemoveMove(index)}
                  >
                    {move.name}
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Combo name"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                className="combo-builder-page__combo-input"
              />
              <div className="combo-builder-page__control-panel">
                <button 
                  className="combo-builder-page__button"
                  onClick={handleSaveCombo}
                >
                  Save Combo
                </button>
                <button 
                  className="combo-builder-page__button combo-builder-page__button--secondary"
                  onClick={() => setCurrentCombo([])}
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="combo-builder-page__workspace-icon">⚡</div>
              <div className="combo-builder-page__workspace-message">
                Select moves from below to create your combo. Click on a move to add it to your sequence.
              </div>
            </>
          )}
        </div>
        
      </div>
      
      {/* Move Selector - Moved outside the workspace section */}
      <div className="combo-builder-page__section">
        <h2 className="combo-builder-page__section-title">Available Moves</h2>
        <div className="combo-builder-page__moves-grid">
          {availableMoves.map((move) => (
            <div 
              key={move.id} 
              className={`combo-builder-page__move-item combo-builder-page__move-item--${move.type}`}
              onClick={() => handleAddMove(move)}
            >
              {move.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Saved Combos */}
      <div className="combo-builder-page__section">
        <h2 className="combo-builder-page__section-title">Saved Combos</h2>
        
        {combos.length === 0 ? (
          <p className="combo-builder-page__empty-message">
            No combos saved yet. Build and save your first combo above!
          </p>
        ) : (
          <div className="combo-builder-page__combos-list">
            {combos.map((combo) => (
              <div key={combo.id} className="combo-builder-page__combo-card">
                <h3 className="combo-builder-page__combo-title">{combo.name}</h3>
                <div className="combo-builder-page__combo-sequence">
                  {combo.moves.map((move, index) => (
                    <div 
                      key={index} 
                      className={`combo-builder-page__move combo-builder-page__move--${move.type}`}
                    >
                      {move.name}
                    </div>
                  ))}
                </div>
                <div className="combo-builder-page__combo-details">
                  <span className="combo-builder-page__combo-damage">
                    Damage: {combo.damage}
                  </span>
                  <span className={`combo-builder-page__combo-difficulty combo-builder-page__combo-difficulty--${combo.difficulty}`}>
                    {combo.difficulty.charAt(0).toUpperCase() + combo.difficulty.slice(1)}
                  </span>
                </div>
                <div className="combo-builder-page__control-panel">
                  <button 
                    className="combo-builder-page__button combo-builder-page__button--danger"
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
    </div>
  );
};

export default ComboBuilderPage;