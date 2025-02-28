import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTimes } from 'react-icons/fa';
import NotationElement from '../../../../components/NotationElement';
import './ComboCanvas.scss';

const ItemTypes = {
  CANVAS_ELEMENT: 'canvasElement'
};

const ReorderableCanvasElement = ({ 
  element, 
  index, 
  onRemove, 
  moveElement 
}) => {
  const ref = useRef(null);
  
  // Setup drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANVAS_ELEMENT,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Setup drop functionality
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CANVAS_ELEMENT,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId()
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      
      // Only perform the move when the mouse has crossed half of the items width
      
      // Dragging left to right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      
      // Dragging right to left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // Time to actually perform the action
      moveElement(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  
  // Connect the drag and drop refs
  drag(drop(ref));
  
  // Determine the category for applying the correct CSS class
  const categoryClass = element.categoryId 
    ? `combo-canvas__element--${element.categoryId}` 
    : '';
  
  const opacity = isDragging ? 0.4 : 1;
  
  return (
    <div 
      ref={ref}
      className="combo-canvas__element-wrapper"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className={`combo-canvas__element ${categoryClass}`}>
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

export default ReorderableCanvasElement;