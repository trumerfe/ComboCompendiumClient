// src/features/comboList/pages/ComboListPage/ComboListPage.jsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ComboList from '../../components/ComboList';
import { useComboList } from '../../hooks/useComboList';
import { toggleSortDirection, selectSortDirection } from '../../store/comboListSlice';
import './ComboListPage.scss';

const ComboListPage = () => {
  const dispatch = useDispatch();
  // Get character and game IDs from URL params
  const { characterId, gameId } = useParams();
  const sortDirection = useSelector(selectSortDirection);
  
  // Use the combo list hook
  const {
    combos,
    status,
    error,
    selectedCharacter,
    selectedGame,
    loadCombos,
    navigateToComboCreation,
    navigateToCharacterSelection
  } = useComboList(characterId);
  
  // Toggle sort direction handler
  const handleToggleSortDirection = () => {
    dispatch(toggleSortDirection());
  };
  
  // If there's no selected character or game, redirect to the appropriate page
  if (!characterId || !gameId) {
    return <Navigate to="/games" replace />;
  }
  
  return (
    <div className="combo-list-page">
      <header className="combo-list-page__header">
        <div className="combo-list-page__navigation">
          <button 
            className="combo-list-page__back-button"
            onClick={navigateToCharacterSelection}
          >
            <span className="combo-list-page__back-icon">←</span>
            Back to Characters
          </button>
        </div>
        
        <div className="combo-list-page__info">
          <h1 className="combo-list-page__title">
            {characterId || 'Character'} Combos
          </h1>
          <p className="combo-list-page__subtitle">
            {gameId || 'Game'}
          </p>
        </div>
        
        <button 
          className="combo-list-page__create-button"
          onClick={navigateToComboCreation}
        >
          Create Combo
        </button>
      </header>
      
      <div className="combo-list-page__sort-controls">
        <span className="combo-list-page__sort-label">Sorted by most likes</span>
        <button 
          className="combo-list-page__sort-direction-button"
          onClick={handleToggleSortDirection}
          title={sortDirection === 'asc' ? 'Showing least liked first' : 'Showing most liked first'}
        >
          <span className="combo-list-page__sort-icon">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
          {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      
      <div className="combo-list-page__content">
        <div className="combo-list-page__combos">
          <ComboList
            status={status}
            error={error}
            onRetry={loadCombos}
            currentUserId="user123" // Hardcoded for now, would come from auth
          />
        </div>
      </div>
    </div>
  );
};

export default ComboListPage;