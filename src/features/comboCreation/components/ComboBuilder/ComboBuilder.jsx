import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ComboElementPanel from '../ComboElementPanel';
import ComboCanvas from '../ComboCanvas';
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
  
  const [activeCategory, setActiveCategory] = useState(
    notationData?.categories && Object.keys(notationData.categories).length > 0
      ? Object.keys(notationData.categories)[0]
      : null
  );
  
  // If no notation data, show a message
  if (!notationData || !notationData.categories) {
    return (
      <div className="combo-builder combo-builder--empty">
        <p>No notation data available for this game.</p>
      </div>
    );
  }
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  return (
    <div className="combo-builder">
      <h2 className="combo-builder__title">Combo Builder</h2>
      
      <div className="combo-builder__categories">
        {Object.keys(notationData.categories).map((categoryId) => (
          <button
            key={categoryId}
            className={`combo-builder__category-button ${
              activeCategory === categoryId ? 'combo-builder__category-button--active' : ''
            }`}
            onClick={() => handleCategoryChange(categoryId)}
          >
            {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="combo-builder__container">
        {/* Element panel with draggable items */}
        <div className="combo-builder__panel">
          <h3 className="combo-builder__section-title">Notation Elements</h3>
          <div className="combo-builder__elements">
            {activeCategory && (
              <ComboElementPanel 
                elements={notationData.categories[activeCategory]} 
                categoryId={activeCategory}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              />
            )}
          </div>
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
          />
        </div>
      </div>
    </div>
  );
};

export default ComboBuilder;