// features/combo-builder/components/MoveList/MoveList.jsx
import React from 'react';
import MoveCard from '../MoveCard';
import './MoveList.scss';

const MoveList = ({ moves, onMoveSelect }) => {
  return (
    <div className="move-list">
      {moves.length === 0 ? (
        <div className="move-list__empty">
          <p>No moves available</p>
        </div>
      ) : (
        <div className="move-list__grid">
          {moves.map(move => (
            <MoveCard
              key={move.id}
              move={move}
              onClick={() => onMoveSelect(move)}
              actionType="add"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveList;