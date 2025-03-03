import React from 'react';
import DraggableElement from '../DraggableElement';
import './ComboElementPanel.scss';

const ComboElementPanel = ({ 
  elements, 
  categoryId, 
  onDragStart, 
  onDragEnd,
  showNumpad = false // Add showNumpad prop with default value
}) => {
  if (!elements || elements.length === 0) {
    return (
      <div className="combo-element-panel combo-element-panel--empty">
        <p>No elements available in this category</p>
      </div>
    );
  }

  return (
    <div className="combo-element-panel">
      <div className="combo-element-panel__grid">
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            categoryId={categoryId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            showNumpad={showNumpad} // Pass showNumpad to DraggableElement
          />
        ))}
      </div>
    </div>
  );
};

export default ComboElementPanel;