import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../contexts/authContext';

import ComboBuilder from '../../components/ComboBuilder';
import ComboForm from '../../components/ComboForm';
import useComboCreation from '../../hooks/useComboCreation';
import './ComboCreationPage.scss';

const ComboCreationPage = () => {
  const navigate = useNavigate();
  const { gameId, characterId } = useParams();
  const { userLoggedIn } = useAuth();
  
  const { 
    notationData, 
    isLoading, 
    isError, 
    error,
    handleCancel,
    handleReset,
    handleSubmit
  } = useComboCreation();
  
  // Check if user is logged in
  useEffect(() => {
    if (!userLoggedIn) {
      toast.error('You must be logged in to create combos');
      navigate(`/games/${gameId}/characters/${characterId}/combos`);
    }
  }, [userLoggedIn, navigate, gameId, characterId]);
  
  // Check if we have the required params
  useEffect(() => {
    if (!gameId || !characterId) {
      toast.error('Missing game or character information');
      navigate('/games');
    }
  }, [gameId, characterId, navigate]);
  
  // If still loading, show a loader
  if (isLoading && !notationData) {
    return (
      <div className="combo-creation-page">
        <div className="combo-creation-page__loading">
          <div className="spinner"></div>
          <p>Loading notation data...</p>
        </div>
      </div>
    );
  }
  
  // If there was an error, show error message
  if (isError) {
    return (
      <div className="combo-creation-page">
        <div className="combo-creation-page__error">
          <h2>Error Loading Data</h2>
          <p>{error || 'An unexpected error occurred'}</p>
          <div className="combo-creation-page__actions">
            <button 
              className="button button--secondary"
              onClick={handleCancel}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="combo-creation-page">
        <header className="combo-creation-page__header">
          <button 
            className="combo-creation-page__back-button"
            onClick={handleCancel}
          >
            <FaArrowLeft /> Back to Combos
          </button>
          <h1 className="combo-creation-page__title">Create New Combo</h1>
        </header>
        
        <div className="combo-creation-page__content">
          {/* Combo Builder Component for drag and drop */}
          <ComboBuilder />
          
          {/* Form for additional combo info */}
          <ComboForm />
        </div>
        
        <div className="combo-creation-page__actions">
          <button 
            className="button button--secondary"
            onClick={handleReset}
          >
            Clear All
          </button>
          <button
            className="button button--primary"
            onClick={handleSubmit}
          >
            Save Combo
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default ComboCreationPage;