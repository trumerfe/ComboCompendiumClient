// src/features/comboBuilder/components/DraggableElement/DraggableElement.jsx
import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import NotationElement from '../../../../components/NotationElement/NotationElement';
// If the path is different in your project, adjust the import accordingly
import { normalizeNotationElement } from '../../services/NotationElementService';
import './DraggableElement.scss';

const DraggableElement = ({ element, categoryId, onDragStart, onDragEnd }) => {
  // Ensure we have a normalized element with all required properties
  const [normalizedElement, setNormalizedElement] = useState(() => 
    normalizeNotationElement({ ...element, categoryId })
  );
  
  // Update normalized element when props change
  useEffect(() => {
    const normalized = normalizeNotationElement({ ...element, categoryId });
    setNormalizedElement(normalized);
  }, [element, categoryId]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NOTATION_ELEMENT',
    item: () => {
      onDragStart && onDragStart();
      console.log('Dragging element:', normalizedElement);
      return normalizedElement;
    },
    end: () => {
      onDragEnd && onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [normalizedElement, onDragStart, onDragEnd]);

  // Get category-specific class for styling
  const categoryClass = `draggable-element--${categoryId}`;

  return (
    <div 
      ref={drag}
      className={`draggable-element ${categoryClass} ${isDragging ? 'draggable-element--dragging' : ''}`}
    >
      <NotationElement 
        element={normalizedElement}
        className="draggable-element__content"
      />
    </div>
  );
};

export default DraggableElement;