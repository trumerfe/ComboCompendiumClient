// Export the page
import ComboCreationPage from './pages/ComboCreationPage';

// Export components
import ComboBuilder from './components/ComboBuilder';
import ComboCanvas from './components/ComboCanvas';
import ComboElementPanel from './components/ComboElementPanel';
import DraggableElement from './components/DraggableElement';
import ComboForm from './components/ComboForm';

// Export hooks
import useComboCreation from './hooks/useComboCreation';

// Export Redux slice and actions
import comboCreationReducer, {
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
} from './store/comboCreationSlice';

export {
  // Page
  ComboCreationPage,
  
  // Components
  ComboBuilder,
  ComboCanvas,
  ComboElementPanel,
  DraggableElement,
  ComboForm,
  
  // Hooks
  useComboCreation,
  
  // Redux
  comboCreationReducer,
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
  
  // Selectors
  selectComboCreationStatus,
  selectComboCreationError,
  selectNotationData,
  selectComboSequence,
  selectComboDetails,
  selectAvailableTags,
  selectSavedCombo
};

// Default export
export default ComboCreationPage;