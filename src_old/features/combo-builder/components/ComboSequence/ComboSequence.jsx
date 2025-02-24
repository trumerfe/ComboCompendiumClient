// features/combo-builder/components/ComboSequence/ComboSequence.jsx
import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MoveCard from '../MoveCard';
import './ComboSequence.scss';

// Sortable move item wrapper
const SortableMoveItem = ({ move, index, onMoveRemove, movesLength }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: move.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="combo-sequence__item"
      {...attributes}
      {...listeners}
    >
      <div className="combo-sequence__item-index">{index + 1}</div>
      <MoveCard
        move={move}
        onClick={() => onMoveRemove(move.id)}
        actionType="remove"
      />
      {index < movesLength - 1 && (
        <div className="combo-sequence__arrow">→</div>
      )}
    </div>
  );
};

const ComboSequence = ({ moves, onMoveRemove, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = moves.findIndex(move => move.id === active.id);
      const newIndex = moves.findIndex(move => move.id === over.id);
      
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="combo-sequence">
      {moves.length === 0 ? (
        <div className="combo-sequence__empty">
          <p>No moves added to the combo yet.</p>
          <p>Select moves from the list on the left to add them to your combo.</p>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="combo-sequence__list">
            <SortableContext 
              items={moves.map(move => move.id)}
              strategy={verticalListSortingStrategy}
            >
              {moves.map((move, index) => (
                <SortableMoveItem
                  key={move.id}
                  move={move}
                  index={index}
                  onMoveRemove={onMoveRemove}
                  movesLength={moves.length}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
      
      {moves.length > 0 && (
        <div className="combo-sequence__stats">
          <div className="combo-sequence__stat">
            <span className="combo-sequence__stat-label">Moves:</span>
            <span className="combo-sequence__stat-value">{moves.length}</span>
          </div>
          <div className="combo-sequence__stat">
            <span className="combo-sequence__stat-label">Total Damage:</span>
            <span className="combo-sequence__stat-value">
              {moves.reduce((total, move) => total + move.damage, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboSequence;