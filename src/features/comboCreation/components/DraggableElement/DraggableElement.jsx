import React from 'react';
import { useDrag } from 'react-dnd';
import './DraggableElement.scss';

const DraggableElement = ({ element, categoryId, onDragStart, onDragEnd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NOTATION_ELEMENT',
    item: () => {
      onDragStart && onDragStart();
      return {
        ...element,
        categoryId,
        id: element.id // Ensure the element ID is passed
      };
    },
    end: () => {
      onDragEnd && onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [element, categoryId, onDragStart, onDragEnd]);

  // Determine how to display the element
  const renderElementContent = () => {
    // If there's an image URL, show the image
    if (element.imageUrl) {
      return (
        <img 
          src={element.imageUrl} 
          alt={element.name} 
          className="draggable-element__image"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.classList.add('draggable-element__image--error');
            e.target.parentNode.classList.add('draggable-element--fallback');
          }}
        />
      );
    }
    
    // If there's a symbol, show that
    if (element.symbol) {
      return <span className="draggable-element__symbol">{element.symbol}</span>;
    }
    
    // Fallback to the name or ID
    return <span className="draggable-element__name">{element.name || element.id}</span>;
  };

  return (
    <div 
      ref={drag}
      className={`draggable-element ${isDragging ? 'draggable-element--dragging' : ''}`}
      title={element.name}
    >
      {renderElementContent()}
    </div>
  );
};

export default DraggableElement;