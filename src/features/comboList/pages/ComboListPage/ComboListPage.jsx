import React from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaPlus, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import ComboList from '../../components/ComboList';
import { useComboList } from '../../hooks/useComboList';
import { toggleSortDirection, selectSortDirection } from '../../store/comboListSlice';
import { useAuth } from '../../../../contexts/authContext';
import './ComboListPage.scss';

const ComboListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get character and game IDs from URL params
  const { characterId, gameId } = useParams();
  const sortDirection = useSelector(selectSortDirection);
  // Get auth state
  const { userLoggedIn } = useAuth();
  
  // Use the combo list hook
  const {
    combos,
    status,
    error,
    selectedCharacter,
    selectedGame,
    loadCombos,
    navigateToCharacterSelection
  } = useComboList(characterId);
  
  // Toggle sort direction handler
  const handleToggleSortDirection = () => {
    dispatch(toggleSortDirection());
  };
  
  // Handler for Create Combo button
  const handleCreateCombo = () => {
    navigate(`/games/${gameId}/characters/${characterId}/builder`);
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
            <span className="combo-list-page__back-icon"><FaArrowLeft /></span>
            Back to Characters
          </button>
        </div>
        
        <div className="combo-list-page__info">
          <h1 className="combo-list-page__title">
            {selectedCharacter?.name || characterId} Combos
          </h1>
          <p className="combo-list-page__subtitle">
            {selectedGame?.name || gameId}
          </p>
        </div>
        
        {userLoggedIn ? (
          <button 
            className="combo-list-page__create-button"
            onClick={handleCreateCombo}
          >
            <FaPlus /> Create Combo
          </button>
        ) : (
          <Link
            to="/login"
            state={{ from: `/games/${gameId}/characters/${characterId}/combos` }}
            className="combo-list-page__login-button"
          >
            Login to Create Combos
          </Link>
        )}
      </header>
      
      <div className="combo-list-page__sort-controls">
        <span className="combo-list-page__sort-label">Sorted by most likes</span>
        <button 
          className="combo-list-page__sort-direction-button"
          onClick={handleToggleSortDirection}
          title={sortDirection === 'asc' ? 'Showing least liked first' : 'Showing most liked first'}
        >
          <span className="combo-list-page__sort-icon">
            {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
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
            // No longer passing currentUserId prop as ComboCard will get it from AuthContext
          />
        </div>
      </div>
    </div>
  );
};

export default ComboListPage;