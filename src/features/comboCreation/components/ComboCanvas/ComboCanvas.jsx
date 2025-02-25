import React from 'react';
import { useDrop } from 'react-dnd';
import { FaTimes } from 'react-icons/fa';
import './ComboCanvas.scss';

const ComboCanvas = ({ 
  sequence, 
  onDropElement, 
  onRemoveElement, 
  onReorderElements,
  isDragging 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'NOTATION_ELEMENT',
    drop: (item) => {
      onDropElement(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [onDropElement]);

  // Helper function to render each element in the sequence
  const renderSequenceElement = (element, index) => {
    // Determine how to display the element
    const renderElementContent = () => {
      // If there's an image URL, show the image
      if (element.imageUrl) {
        return (
          <img 
            src={element.imageUrl} 
            alt={element.name} 
            className="combo-canvas__element-image"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.classList.add('combo-canvas__element-image--error');
              e.target.parentNode.classList.add('combo-canvas__element--fallback');
            }}
          />
        );
      }
      
      // If there's a symbol, show that
      if (element.symbol) {
        return <span className="combo-canvas__element-symbol">{element.symbol}</span>;
      }
      
      // Fallback to the name or ID
      const displayText = element.name || element.id;
      return <span className="combo-canvas__element-name">{displayText}</span>;
    };
    
    // Add a small indicator of the element's category for debugging/clarity
    const categoryClass = `combo-canvas__element--${element.categoryId}`;

    return (
      <div key={`${element.id}-${index}`} className="combo-canvas__element-wrapper">
        <div className={`combo-canvas__element ${categoryClass}`}>
          {renderElementContent()}
          <button 
            className="combo-canvas__element-remove" 
            onClick={() => onRemoveElement(index)}
          >
            <FaTimes size={10} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={drop}
      className={`combo-canvas ${isOver ? 'combo-canvas--over' : ''}`}
    >
      {sequence.length === 0 ? (
        <div className="combo-canvas__empty">
          <p>Drag elements here to build your combo</p>
          {isDragging && <p className="combo-canvas__drop-hint">Drop here!</p>}
        </div>
      ) : (
        <div className="combo-canvas__sequence">
          {sequence.map(renderSequenceElement)}
          {isDragging && (
            <div className="combo-canvas__drop-indicator">
              <span>+</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboCanvas;