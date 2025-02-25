import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  fetchNotationData,
  saveCombo,
  setGameAndCharacter,
  addElementToSequence,
  removeElementFromSequence,
  reorderComboSequence,
  clearComboSequence,
  updateComboName,
  updateComboDamage,
  updateComboDifficulty,
  updateComboDescription,
  updateComboVideo,
  addComboTag,
  removeComboTag,
  resetComboCreation,
  selectComboCreationStatus,
  selectComboCreationError,
  selectNotationData,
  selectComboSequence,
  selectComboDetails,
  selectAvailableTags,
  selectSavedCombo
} from '../store/comboCreationSlice';

const useComboCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameId, characterId } = useParams();
  
  // Local drag state
  const [isDragging, setIsDragging] = useState(false);
  
  // Selectors
  const status = useSelector(selectComboCreationStatus);
  const error = useSelector(selectComboCreationError);
  const notationData = useSelector(selectNotationData);
  const comboSequence = useSelector(selectComboSequence);
  const comboDetails = useSelector(selectComboDetails);
  const availableTags = useSelector(selectAvailableTags);
  const savedCombo = useSelector(selectSavedCombo);
  
  const isLoading = status === 'loading';
  const isError = status === 'failed';
  
  // Initialize with game and character IDs from URL
  useEffect(() => {
    if (gameId && characterId) {
      dispatch(setGameAndCharacter({ gameId, characterId }));
      dispatch(fetchNotationData({ gameId, characterId }));
    }
  }, [dispatch, gameId, characterId]);
  
  // Element handling functions
  const handleAddElement = useCallback((element) => {
    dispatch(addElementToSequence(element));
  }, [dispatch]);
  
  const handleRemoveElement = useCallback((index) => {
    dispatch(removeElementFromSequence({ index }));
  }, [dispatch]);
  
  const handleReorderElements = useCallback((oldIndex, newIndex) => {
    dispatch(reorderComboSequence({ oldIndex, newIndex }));
  }, [dispatch]);
  
  const handleClearSequence = useCallback(() => {
    dispatch(clearComboSequence());
  }, [dispatch]);
  
  // Form handling functions
  const handleNameChange = useCallback((name) => {
    dispatch(updateComboName(name));
  }, [dispatch]);
  
  const handleDamageChange = useCallback((damage) => {
    dispatch(updateComboDamage(damage));
  }, [dispatch]);
  
  const handleDifficultyChange = useCallback((difficulty) => {
    dispatch(updateComboDifficulty(difficulty));
  }, [dispatch]);
  
  const handleDescriptionChange = useCallback((description) => {
    dispatch(updateComboDescription(description));
  }, [dispatch]);
  
  const handleVideoChange = useCallback((video) => {
    dispatch(updateComboVideo(video));
  }, [dispatch]);
  
  const handleAddTag = useCallback((tag) => {
    dispatch(addComboTag(tag));
  }, [dispatch]);
  
  const handleRemoveTag = useCallback((tag) => {
    dispatch(removeComboTag(tag));
  }, [dispatch]);
  
  // Submission handling
  const handleSubmit = useCallback(async () => {
    if (comboSequence.length === 0) {
      toast.error('Combo sequence cannot be empty');
      return;
    }
    
    if (!comboDetails.name.trim()) {
      toast.error('Please provide a name for your combo');
      return;
    }
    
    const comboData = {
      gameId,
      characterId,
      name: comboDetails.name,
      notation: comboSequence.map(element => ({
        categoryId: element.categoryId,
        elementId: element.id
      })),
      damage: parseInt(comboDetails.damage) || 0,
      difficulty: comboDetails.difficulty,
      description: comboDetails.description,
      video: comboDetails.video,
      tags: comboDetails.tags,
      createdBy: 'user123', // Normally would be the current user ID
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };
    
    try {
      await dispatch(saveCombo(comboData)).unwrap();
      toast.success('Combo created successfully!');
      navigate(`/games/${gameId}/characters/${characterId}/combos`);
    } catch (err) {
      toast.error(err || 'Failed to create combo');
    }
  }, [
    dispatch, navigate, gameId, characterId,
    comboSequence, comboDetails
  ]);
  
  // Reset form
  const handleReset = useCallback(() => {
    dispatch(resetComboCreation());
  }, [dispatch]);
  
  // Go back to combo list
  const handleCancel = useCallback(() => {
    navigate(`/games/${gameId}/characters/${characterId}/combos`);
  }, [navigate, gameId, characterId]);
  
  return {
    // State
    gameId,
    characterId,
    notationData,
    comboSequence,
    comboDetails,
    availableTags,
    status,
    isLoading,
    isError,
    error,
    isDragging,
    setIsDragging,
    
    // Element Functions
    handleAddElement,
    handleRemoveElement,
    handleReorderElements,
    handleClearSequence,
    
    // Form Functions
    handleNameChange,
    handleDamageChange,
    handleDifficultyChange,
    handleDescriptionChange,
    handleVideoChange,
    handleAddTag,
    handleRemoveTag,
    
    // Action Functions
    handleSubmit,
    handleReset,
    handleCancel
  };
};

export default useComboCreation;