import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ComboCanvas from '../ComboCanvas';
import DraggableElement from '../DraggableElement';
import useComboCreation from '../../hooks/useComboCreation';
import './ComboBuilder.scss';

const ComboBuilder = () => {
  const {
    notationData,
    comboSequence,
    handleAddElement,
    handleRemoveElement,
    handleReorderElements,
    handleClearSequence,
    isDragging,
    setIsDragging
  } = useComboCreation();
  
  const [showNumpad, setShowNumpad] = useState(false);
  
  if (!notationData || !notationData.categories) {
    return (
      <div className="combo-builder combo-builder--empty">
        <p>No notation data available for this game.</p>
      </div>
    );
  }
  
  const toggleNumpadDisplay = () => {
    setShowNumpad(prev => !prev);
  };
  
  return (
    <div className="combo-builder">
      <div className="combo-builder__header">
        <h2 className="combo-builder__title">Combo Builder</h2>
        
        <button 
          className={`combo-builder__display-toggle ${showNumpad ? 'combo-builder__display-toggle--active' : ''}`}
          onClick={toggleNumpadDisplay}
          title={showNumpad ? 'Show symbols' : 'Show numpad notation'}
        >
          <span>{showNumpad ? 'Icons' : 'Numpad'}</span>
        </button>
      </div>
      
      {/* Even more compact panel with inline category headers */}
      <div className="combo-builder__panel">
        {Object.entries(notationData.categories).map(([categoryId, elements]) => (
          elements && elements.length > 0 ? (
            <div key={categoryId} className="combo-builder__category">
              <span className="combo-builder__category-label">{categoryId}</span>
              <div className="combo-builder__category-elements">
                {elements.map((element) => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    categoryId={categoryId}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    showNumpad={showNumpad}
                  />
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
      
      {/* Canvas where elements are dropped */}
      <div className="combo-builder__canvas-container">
        <div className="combo-builder__canvas-header">
          <h3 className="combo-builder__section-title">Combo Sequence</h3>
          {comboSequence.length > 0 && (
            <button 
              className="combo-builder__clear-button"
              onClick={handleClearSequence}
              title="Clear sequence"
            >
              <FaTrash />
              <span>Clear</span>
            </button>
          )}
        </div>
        
        <ComboCanvas 
          sequence={comboSequence}
          onDropElement={handleAddElement}
          onRemoveElement={handleRemoveElement}
          onReorderElements={handleReorderElements}
          isDragging={isDragging}
          showNumpad={showNumpad}
        />
      </div>
    </div>
  );
};

export default ComboBuilder;