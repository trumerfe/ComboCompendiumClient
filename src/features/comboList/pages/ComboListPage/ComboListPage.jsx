import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import ComboList from '../../components/ComboList';
import ComboControls from '../../components/ComboControls';
import { useComboList } from '../../hooks/useComboList';
import { useAuth } from '../../../../contexts/authContext';
import './ComboListPage.scss';

const ComboListPage = () => {
  // Get character and game IDs from URL params
  const { characterId, gameId } = useParams();
  // Get auth state
  const { userLoggedIn } = useAuth();
  
  // Pass both characterId and gameId to the hook
  const {
    status,
    error,
    selectedCharacter,
    selectedGame,
    loadCombos,
    navigateToCharacterSelection,
    navigateToComboCreation
  } = useComboList(characterId, gameId);
  
  // Add debug logging to check state values
  useEffect(() => {
    console.log('ComboListPage Debug:', {
      characterId,
      gameId,
      userLoggedIn,
      selectedCharacter,
      selectedGame
    });
  }, [characterId, gameId, userLoggedIn, selectedCharacter, selectedGame]);
  
  // Modified handler with logging
  const handleCreateCombo = () => {
    console.log('Create combo button clicked');
    navigateToComboCreation();
  };
  
  // If there's no character or game ID, redirect to the appropriate page
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
            data-testid="create-combo-button"
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
      
      <div className="combo-list-page__content">
        <ComboControls />
        <div className="combo-list-page__combos">
          <ComboList
            status={status}
            error={error}
            onRetry={loadCombos}
          />
        </div>
      </div>
    </div>
  );
};

export default ComboListPage;