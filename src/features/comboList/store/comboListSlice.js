// src/features/comboList/store/comboListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCombosByCharacterId, 
  likeCombo as likeComboService,
  dislikeCombo as dislikeComboService
} from '../../../services/apiService';

// Helper function to safely sort combos
const sortCombosByLikes = (combos = [], direction = 'desc') => {
  if (!Array.isArray(combos)) return [];
  
  return [...combos].sort((a, b) => {
    // Updated to handle likes as arrays instead of numbers
    const aLikes = a?.likes?.length || 0;
    const bLikes = b?.likes?.length || 0;
    const comparison = aLikes - bLikes;
    return direction === 'asc' ? comparison : -comparison;
  });
};

// Fetch combos thunk - updated for new API format
export const fetchCombosByCharacterId = createAsyncThunk(
  'comboList/fetchCombosByCharacterId',
  async (characterId, { rejectWithValue, getState }) => {
    if (!characterId) {
      return rejectWithValue('Character ID is required');
    }
    
    try {
      // Get current sort direction
      const { sortDirection } = getState().comboList;
      
      // Get combos using the new API service
      const response = await getCombosByCharacterId(characterId, {
        sortBy: 'likes',
        sortDirection
      });
      
      // Handle new API response format
      if (response.success) {
        // The data is already processed by the backend with expanded notation
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch combos');
      }
    } catch (error) {
      console.error('Error fetching combos:', error);
      return rejectWithValue(error.message || 'Failed to fetch combos');
    }
  }
);

// Updated thunk for liking a combo
export const likeCombo = createAsyncThunk(
  'comboList/likeCombo',
  async (comboId, { rejectWithValue }) => {
    if (!comboId) {
      return rejectWithValue('Combo ID is required');
    }
    
    try {
      const response = await likeComboService(comboId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to like combo');
      }
    } catch (error) {
      console.error('Error liking combo:', error);
      return rejectWithValue(error.message || 'Failed to like combo');
    }
  }
);

// Updated thunk for disliking a combo
export const dislikeCombo = createAsyncThunk(
  'comboList/dislikeCombo',
  async (comboId, { rejectWithValue }) => {
    if (!comboId) {
      return rejectWithValue('Combo ID is required');
    }
    
    try {
      const response = await dislikeComboService(comboId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to dislike combo');
      }
    } catch (error) {
      console.error('Error disliking combo:', error);
      return rejectWithValue(error.message || 'Failed to dislike combo');
    }
  }
);

const comboListSlice = createSlice({
  name: 'comboList',
  initialState: {
    combos: [],
    sortBy: 'likes', // Default sort by likes
    sortDirection: 'desc', // Default sort direction is descending (most likes first)
    status: 'idle',
    error: null
  },
  reducers: {
    clearCombos: (state) => {
      state.combos = [];
      state.status = 'idle';
      state.error = null;
    },
    
    // Add a reducer to change sort direction
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    
    // Add a reducer to update a combo (for like/dislike actions)
    updateCombo: (state, action) => {
      if (Array.isArray(state.combos)) {
        const index = state.combos.findIndex(combo => combo.id === action.payload.id);
        if (index !== -1) {
          state.combos[index] = action.payload;
          
          // Re-sort combos if needed
          state.combos = sortCombosByLikes(state.combos, state.sortDirection);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Existing fetch cases
      .addCase(fetchCombosByCharacterId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCombosByCharacterId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Ensure we have valid data
        const combos = action.payload || [];
        
        // The backend should handle sorting, but we'll sort again just in case
        state.combos = sortCombosByLikes(combos, state.sortDirection);
        state.error = null;
      })
      .addCase(fetchCombosByCharacterId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
        state.combos = []; // Reset combos to empty array on error
      })
      
      // Like combo cases
      .addCase(likeCombo.fulfilled, (state, action) => {
        // We now get the full updated combo from the API
        const updatedCombo = action.payload;
        
        // Ensure combos exists and is an array
        if (Array.isArray(state.combos)) {
          // Update the combo in the list
          state.combos = state.combos.map(combo => 
            combo.id === updatedCombo.id 
              ? updatedCombo
              : combo
          );
          
          // Re-sort by likes
          state.combos = sortCombosByLikes(state.combos, state.sortDirection);
        }
      })
      .addCase(likeCombo.rejected, (state, action) => {
        state.error = action.payload || 'Failed to like combo';
      })
      
      // Dislike combo cases
      .addCase(dislikeCombo.fulfilled, (state, action) => {
        // We now get the full updated combo from the API
        const updatedCombo = action.payload;
        
        // Ensure combos exists and is an array
        if (Array.isArray(state.combos)) {
          // Update the combo in the list
          state.combos = state.combos.map(combo => 
            combo.id === updatedCombo.id 
              ? updatedCombo
              : combo
          );
        }
      })
      .addCase(dislikeCombo.rejected, (state, action) => {
        state.error = action.payload || 'Failed to dislike combo';
      });
  }
});

// Export actions
export const { clearCombos, toggleSortDirection, updateCombo } = comboListSlice.actions;

// Export selectors
export const selectCombos = state => state.comboList?.combos || [];
export const selectComboListStatus = state => state.comboList?.status || 'idle';
export const selectComboListError = state => state.comboList?.error || null;
export const selectSortDirection = state => state.comboList?.sortDirection || 'desc';

export default comboListSlice.reducer;