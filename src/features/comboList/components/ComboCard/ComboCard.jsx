// src/features/comboList/components/ComboCard/ComboCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { likeCombo, dislikeCombo } from '../../store/comboListSlice';
import NotationElement from '../../../../components/NotationElement';
import './ComboCard.scss';

const ComboCard = ({ combo, currentUserId = 'user123' }) => {
  // Ensure combo is a valid object
  if (!combo || typeof combo !== 'object') {
    return null; // Don't render anything if combo is invalid
  }
  
  const dispatch = useDispatch();
  
  // Destructure with default values to prevent undefined errors
  const { 
    id: comboId = '',
    name = 'Unnamed Combo', 
    expandedNotation = [], 
    damage = 0, 
    difficulty = 'medium', 
    tags = [], 
    createdAt = new Date().toISOString(), 
    likes = 0, 
    dislikes = 0 
  } = combo;

  // Format date - handle invalid dates gracefully
  let formattedDate = '';
  try {
    formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    formattedDate = 'Unknown date';
  }

  // Get difficulty class
  const getDifficultyClass = (diff) => {
    switch (String(diff).toLowerCase()) {
      case 'easy':
        return 'combo-card__difficulty--easy';
      case 'medium':
        return 'combo-card__difficulty--medium';
      case 'hard':
        return 'combo-card__difficulty--hard';
      default:
        return '';
    }
  };
  
  // Like/Dislike handlers
  const handleLike = () => {
    if (!comboId) return; // Don't dispatch if no combo ID
    dispatch(likeCombo({ comboId, userId: currentUserId }));
  };
  
  const handleDislike = () => {
    if (!comboId) return; // Don't dispatch if no combo ID
    dispatch(dislikeCombo({ comboId, userId: currentUserId }));
  };

  return (
    <div className="combo-card">
      <div className="combo-card__header">
        <h3 className="combo-card__title">{name}</h3>
        <div className="combo-card__stats">
          <div className={`combo-card__difficulty ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </div>
          <div className="combo-card__damage">
            <span className="combo-card__damage-label">Damage:</span>
            <span className="combo-card__damage-value">{damage}</span>
          </div>
        </div>
      </div>
      
      <div className="combo-card__notation">
        {Array.isArray(expandedNotation) && expandedNotation.map((element, index) => (
          <NotationElement 
            key={`notation-element-${index}`}
            element={element}
            className="combo-card__notation-element"
          />
        ))}
      </div>
      
      <div className="combo-card__footer">
        <div className="combo-card__tags">
          {Array.isArray(tags) && tags.map(tag => (
            <span key={tag} className="combo-card__tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="combo-card__meta">
          <div className="combo-card__date">
            {formattedDate}
          </div>
          
          <div className="combo-card__rating">
            <button 
              className="combo-card__like-button"
              onClick={handleLike}
              aria-label="Like combo"
              title="Like this combo"
            >
              <span className="combo-card__likes">
                <i className="icon-thumbs-up">👍</i> {likes}
              </span>
            </button>
            
            <button 
              className="combo-card__dislike-button"
              onClick={handleDislike}
              aria-label="Dislike combo"
              title="Dislike this combo"
            >
              <span className="combo-card__dislikes">
                <i className="icon-thumbs-down">👎</i> {dislikes}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboCard;