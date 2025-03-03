import React from 'react';
import { useSelector } from 'react-redux';
import ComboCard from '../ComboCard';
import { selectCombos, selectComboListStatus } from '../../store/comboListSlice';
import { useAuth } from '../../../../contexts/authContext';
import './ComboList.scss';

const ComboList = ({ status, error, onRetry }) => {
  // Get auth status - we don't pass currentUserId anymore as ComboCard gets it from context
  const { userLoggedIn } = useAuth();
  
  // Get combos from Redux - ensure it has a default value
  const combosFromState = useSelector(selectCombos);
  const combos = Array.isArray(combosFromState) ? combosFromState : [];
  
  const listStatus = useSelector(selectComboListStatus);
  
  // Use provided status or get from store
  const currentStatus = status || listStatus;

  // Handle loading state
  if (currentStatus === 'loading') {
    return (
      <div className="combo-list combo-list--loading">
        <div className="combo-list__loading-spinner"></div>
        <p className="combo-list__loading-text">Loading combos...</p>
      </div>
    );
  }

  // Handle error state
  if (currentStatus === 'failed') {
    return (
      <div className="combo-list combo-list--error">
        <div className="combo-list__error-icon">!</div>
        <h3 className="combo-list__error-title">Failed to load combos</h3>
        <p className="combo-list__error-message">{error}</p>
        <button 
          className="combo-list__retry-button" 
          onClick={onRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle empty state
  if (combos.length === 0 && currentStatus === 'succeeded') {
    return (
      <div className="combo-list combo-list--empty">
        <div className="combo-list__empty-icon">🔍</div>
        <h3 className="combo-list__empty-title">No combos found</h3>
        <p className="combo-list__empty-message">
          {userLoggedIn ? 'Be the first to create a combo for this character!' : 'Log in to create combos for this character!'}
        </p>
      </div>
    );
  }

  // Render combo list - ensure we're only mapping if combos is an array
  return (
    <div className="combo-list">
      <div className="combo-list__combos">
        {combos.map((combo) => (
          <ComboCard 
            key={combo.id} 
            combo={combo}
          />
        ))}
      </div>
    </div>
  );
};

export default ComboList;