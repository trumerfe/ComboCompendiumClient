// features/combo-builder/store/comboBuilderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // All combos for the selected character
  combos: [],
  // Currently being built combo
  currentCombo: [],
  // Available moves for the selected character
  availableMoves: [],
  isLoading: false,
  error: null
};

const comboBuilderSlice = createSlice({
  name: 'comboBuilder',
  initialState,
  reducers: {
    // Set all available combos for a character
    setCombos: (state, action) => {
      state.combos = action.payload;
    },
    
    // Add a move to the current combo
    addMove: (state, action) => {
      state.currentCombo.push({
        ...action.payload,
        id: `${action.payload.id}_${Date.now()}` // Ensure unique ID for drag/drop
      });
    },
    
    // Remove a move from the current combo
    removeMove: (state, action) => {
      state.currentCombo = state.currentCombo.filter(
        move => move.id !== action.payload
      );
    },
    
    // Reorder moves in the current combo (for drag and drop)
    reorderMoves: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const result = [...state.currentCombo];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.currentCombo = result;
    },
    
    // Set available moves for the character
    setAvailableMoves: (state, action) => {
      state.availableMoves = action.payload;
    },
    
    // Clear the current combo being built
    clearCurrentCombo: (state) => {
      state.currentCombo = [];
    },
    
    // Add a new combo to the list after saving
    addComboToList: (state, action) => {
      state.combos.push(action.payload);
    },
    
    // Delete a combo from the list
    deleteCombo: (state, action) => {
      state.combos = state.combos.filter(combo => combo.id !== action.payload);
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Export actions
export const { 
  setCombos, 
  addMove, 
  removeMove, 
  reorderMoves, 
  setAvailableMoves,
  clearCurrentCombo,
  addComboToList,
  deleteCombo,
  setLoading,
  setError
} = comboBuilderSlice.actions;

// Export selectors
export const selectCombos = state => state.comboBuilder.combos;
export const selectCurrentCombo = state => state.comboBuilder.currentCombo;
export const selectAvailableMoves = state => state.comboBuilder.availableMoves;
export const selectIsLoading = state => state.comboBuilder.isLoading;
export const selectError = state => state.comboBuilder.error;

// Export reducer
export default comboBuilderSlice.reducer;