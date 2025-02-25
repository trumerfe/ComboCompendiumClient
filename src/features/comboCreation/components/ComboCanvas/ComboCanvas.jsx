// src/features/comboBuilder/components/ComboCanvas/ComboCanvas.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { FaTimes } from 'react-icons/fa';
import NotationElement from '../../../../components/NotationElement';
// If the path is different in your project, adjust the import accordingly
import './ComboCanvas.scss';

// Component for a canvas element with remove button
const CanvasElement = ({ element, index, onRemove }) => {
  return (
    <div className="combo-canvas__element-wrapper">
      <div className="combo-canvas__element">
        <NotationElement 
          element={element}
          className="combo-canvas__notation-element"
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