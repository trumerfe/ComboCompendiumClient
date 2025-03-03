import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import NotationElement from '../../../../components/NotationElement';
import { useAuth } from '../../../../contexts/authContext';
import { likeCombo, dislikeCombo, getGameNotation } from '../../../../services/apiService';
import { updateCombo } from '../../store/comboListSlice';
import { expandComboNotation } from '../../../../services/notationService';
import './ComboCard.scss';

const ComboCard = ({ combo }) => {
  // Ensure combo is a valid object
  if (!combo || typeof combo !== 'object') {
    return null; // Don't render anything if combo is invalid
  }

  console.log(combo)
  
  const dispatch = useDispatch();
  const { currentUser, userLoggedIn } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [expandedNotation, setExpandedNotation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNumpad, setShowNumpad] = useState(false); // Option to toggle numpad display
  
  // Destructure with default values to prevent undefined errors
  const { 
    id: comboId = '',
    name = 'Unnamed Combo', 
    damage = 0, 
    difficulty = 'medium', 
    tags = [], 
    createdAt = new Date().toISOString(), 
    likes = [], 
    dislikes = [] 
  } = combo;

  // Add in a useEffect
useEffect(() => {
  const debugAPI = async () => {
    if (combo && combo.gameId) {
      try {
        console.log('Debugging API for game:', combo.gameId);
        const response = await getGameNotation(combo.gameId);
        console.log('API Response for notation data:', response);
        
        // Check if it has the expected structure
        if (response && response.success && response.data) {
          console.log('Response data structure:', Object.keys(response.data));
          
          // Check if categories exist
          if (response.data.buttons) {
            console.log('Sample buttons:', response.data.buttons.slice(0, 2));
          } else {
            console.log('No buttons category found!');
          }
        }
      } catch (error) {
        console.error('API Debug Error:', error);
      }
    }
  };
  
  debugAPI();
}, [combo]);

  // Fetch and expand notation when the combo changes
  useEffect(() => {
    const loadExpandedNotation = async () => {
      if (!combo) {
        setExpandedNotation([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Expand the combo notation using the service
        const expanded = await expandComboNotation(combo);
        setExpandedNotation(expanded);
      } catch (error) {
        console.error('Error expanding notation:', error);
        // In case of error, use the raw notation
        setExpandedNotation(combo.notation || []);
      } finally {
        setLoading(false);
      }
    };
    
    loadExpandedNotation();
  }, [combo]);

  // Check if the current user has already liked/disliked
  const hasLiked = userLoggedIn && Array.isArray(likes) && currentUser?.uid && likes.includes(currentUser.uid);
  const hasDisliked = userLoggedIn && Array.isArray(dislikes) && currentUser?.uid && dislikes.includes(currentUser.uid);

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
  const handleLike = async () => {
    if (!comboId) return; // Don't proceed if no combo ID
    
    if (!userLoggedIn) {
      toast.info('Please log in to like combos');
      return;
    }
    
    try {
      setIsLiking(true);
      const response = await likeCombo(comboId);
      
      // New API returns { success: true, data: {...} }
      if (response.success) {
        dispatch(updateCombo(response.data));
        if (!hasLiked) {
          toast.success('Combo liked!');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to like combo');
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleDislike = async () => {
    if (!comboId) return; // Don't proceed if no combo ID
    
    if (!userLoggedIn) {
      toast.info('Please log in to dislike combos');
      return;
    }
    
    try {
      setIsDisliking(true);
      const response = await dislikeCombo(comboId);
      
      if (response.success) {
        dispatch(updateCombo(response.data));
        if (!hasDisliked) {
          toast.success('Combo disliked');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to dislike combo');
    } finally {
      setIsDisliking(false);
    }
  };

  // Toggle numpad display
  const toggleNumpad = () => {
    setShowNumpad(prev => !prev);
  };

  if (loading) {
    return <div className="combo-card combo-card--loading">Loading combo...</div>;
  }

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
          <button 
            className={`combo-card__toggle-button ${showNumpad ? 'combo-card__toggle-button--active' : ''}`}
            onClick={toggleNumpad}
            title={showNumpad ? 'Show symbols' : 'Show numpad'}
          >
            {showNumpad ? 'ABC' : '123'}
          </button>
        </div>
      </div>
      
      <div className="combo-card__notation">
        {Array.isArray(expandedNotation) && expandedNotation.length > 0 ? (
          expandedNotation.map((element, index) => (
            <NotationElement 
              key={`notation-element-${index}`}
              element={element}
              className="combo-card__notation-element"
              showNumpad={showNumpad}
            />
          ))
        ) : (
          <div className="combo-card__notation-empty">
            No notation available
          </div>
        )}
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
              className={`combo-card__like-button ${hasLiked ? 'combo-card__like-button--active' : ''}`}
              onClick={handleLike}
              disabled={isLiking || isDisliking}
              aria-label="Like combo"
              title="Like this combo"
            >
              <span className="combo-card__likes">
                <i className="icon-thumbs-up">👍</i> {Array.isArray(likes) ? likes.length : 0}
              </span>
            </button>
            
            <button 
              className={`combo-card__dislike-button ${hasDisliked ? 'combo-card__dislike-button--active' : ''}`}
              onClick={handleDislike}
              disabled={isLiking || isDisliking}
              aria-label="Dislike combo"
              title="Dislike this combo"
            >
              <span className="combo-card__dislikes">
                <i className="icon-thumbs-down">👎</i> {Array.isArray(dislikes) ? dislikes.length : 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboCard;