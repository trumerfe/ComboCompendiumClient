// features/combo-builder/components/MoveCard/MoveCard.jsx
import React from 'react';
import './MoveCard.scss';

const MoveCard = ({ move, onClick, actionType = 'add' }) => {
  return (
    <div className="move-card">
      <div className="move-card__content">
        <div className="move-card__header">
          <h4 className="move-card__name">{move.name}</h4>
          <span className="move-card__damage">{move.damage}</span>
        </div>
        <div className="move-card__input">{move.input}</div>
      </div>
      <button 
        className={`move-card__button move-card__button--${actionType}`}
        onClick={onClick}
        aria-label={actionType === 'add' ? 'Add move' : 'Remove move'}
      >
        {actionType === 'add' ? '+' : '×'}
      </button>
    </div>
  );
};

export default MoveCard;