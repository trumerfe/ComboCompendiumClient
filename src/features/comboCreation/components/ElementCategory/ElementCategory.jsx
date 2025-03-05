import React from 'react';
import DraggableElement from '../DraggableElement';
import './ElementCategory.scss';

const ElementCategory = ({ 
  categoryId, 
  elements, 
  onDragStart, 
  onDragEnd, 
  showNumpad = false 
}) => {
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <div className="element-category">
      <div className="element-category__header">
        <span className="element-category__title">
          {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
        </span>
      </div>
      <div className="element-category__elements">
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            categoryId={categoryId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            showNumpad={showNumpad}
          />
        ))}
      </div>
    </div>
  );
};

export default ElementCategory;