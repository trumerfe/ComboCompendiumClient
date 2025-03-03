// src/features/comboBuilder/components/ComboCanvas/ComboCanvas.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { FaTimes } from 'react-icons/fa';
import NotationElement from '../../../../components/NotationElement';
// If the path is different in your project, adjust the import accordingly
import './ComboCanvas.scss';

// Component for a canvas element with remove button
const CanvasElement = ({ element, index, onRemove, showNumpad }) => {
  // Determine the category for applying the correct CSS class
  const categoryClass = element.categoryId 
    ? `combo-canvas__element--${element.categoryId}` 
    : '';
    
  return (
    <div className="combo-canvas__element-wrapper">
      <div className={`combo-canvas__element ${categoryClass}`}>
        <NotationElement 
          element={element}
          className="combo-canvas__notation-element"
          showNumpad={showNumpad} // Pass showNumpad to NotationElement
        />
        <button 
          className="combo-canvas__element-remove" 
          onClick={() => onRemove(index)}
          title="Remove element"
        >
          <FaTimes size={10} />
        </button>
      </div>
    </div>
  );
};

const ComboCanvas = ({ 
  sequence, 
  onDropElement, 
  onRemoveElement, 
  onReorderElements,
  isDragging,
  showNumpad = false // Add showNumpad prop with default value 
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
          {sequence.map((element, index) => (
            <CanvasElement 
              key={`${element.id || element.elementId || ''}-${index}`}
              element={element}
              index={index}
              onRemove={onRemoveElement}
              showNumpad={showNumpad} // Pass showNumpad to CanvasElement
            />
          ))}
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