// src/features/comboList/store/comboListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCombosByCharacterId, 
  getExpandedCombo, 
  getGameNotation, 
  getNotationElement,
  likeCombo as likeComboService,
  dislikeCombo as dislikeComboService
} from '../../../services/mockDataService';

// Helper function for expanding combo notation
const expandComboNotation = async (combo) => {
  if (!combo) return null;
  
  try {
    // Get game notation for this combo
    const gameNotation = await getGameNotation(combo.gameId);
    if (!gameNotation) return combo;
    
    // Map notation elements to their expanded form
    const expandedNotation = await Promise.all(
      (combo.notation || []).map(async (item) => {
        if (!item) return { display: '?', description: 'Unknown' };
        
        const { categoryId, elementId } = item;
        
        // Get the full notation element
        const notationElement = await getNotationElement(combo.gameId, categoryId, elementId);
        
        return {
          ...item,
          display: notationElement?.symbol || '?',
          description: notationElement?.name || 'Unknown'
        };
      })
    );
    
    return {
      ...combo,
      expandedNotation
    };
  } catch (error) {
    console.error('Error expanding combo notation:', error);
    return combo;
  }
};

// Helper function to safely sort combos
const sortCombosByLikes = (combos = [], direction = 'desc') => {
  if (!Array.isArray(combos)) return [];
  
  return [...combos].sort((a, b) => {
    const aLikes = a?.likes || 0;
    const bLikes = b?.likes || 0;
    const comparison = aLikes - bLikes;
    return direction === 'asc' ? comparison : -comparison;
  });
};

// Fetch combos thunk
export const fetchCombosByCharacterId = createAsyncThunk(
  'comboList/fetchCombosByCharacterId',
  async (characterId, { rejectWithValue }) => {
    if (!characterId) {
      return rejectWithValue('Character ID is required');
    }
    
    try {
      // Get combos using the mockDataService
      const combos = await getCombosByCharacterId(characterId);
      
      if (!Array.isArray(combos)) {
        return [];
      }
      
      // Expand notation for each combo
      const expandedCombos = await Promise.all(
        combos.map(async combo => {
          if (!combo) return null;
          return await expandComboNotation(combo);
        })
      );
      
      // Filter out any null values
      return expandedCombos.filter(Boolean);
    } catch (error) {
      console.error('Error fetching combos:', error);
      return rejectWithValue(error.message || 'Failed to fetch combos');
    }
  }
);

// New thunk for liking a combo
export const likeCombo = createAsyncThunk(
  'comboList/likeCombo',
  async ({ comboId, userId }, { rejectWithValue }) => {
    if (!comboId || !userId) {
      return rejectWithValue('Combo ID and User ID are required');
    }
    
    try {
      const updatedCombo = await likeComboService(comboId, userId);
      return { comboId, updatedCombo };
    } catch (error) {
      console.error('Error liking combo:', error);
      return rejectWithValue(error.message || 'Failed to like combo');
    }
  }
);

// New thunk for disliking a combo
export const dislikeCombo = createAsyncThunk(
  'comboList/dislikeCombo',
  async ({ comboId, userId }, { rejectWithValue }) => {
    if (!comboId || !userId) {
      return rejectWithValue('Combo ID and User ID are required');
    }
    
    try {
      const updatedCombo = await dislikeComboService(comboId, userId);
      return { comboId, updatedCombo };
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
      
      // Re-sort the combos
      if (state.combos && state.combos.length > 0) {
        state.combos = sortCombosByLikes(state.combos, state.sortDirection);
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
        
        // Sort combos by likes (default)
        state.combos = sortCombosByLikes(combos, state.sortDirection);
        state.error = null;
      })
      .addCase(fetchCombosByCharacterId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
        state.combos = []; // Reset combos to empty array on error
      })
      
      // Like combo cases
      .addCase(likeCombo.pending, (state) => {
        // Optional: could add a 'liking' state if needed
      })
      .addCase(likeCombo.fulfilled, (state, action) => {
        const { comboId, updatedCombo } = action.payload;
        
        // Ensure combos exists and is an array
        if (Array.isArray(state.combos)) {
          // Update the combo in the list
          state.combos = state.combos.map(combo => 
            combo.id === comboId 
              ? { ...combo, likes: updatedCombo.likes }
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
      .addCase(dislikeCombo.pending, (state) => {
        // Optional: could add a 'disliking' state if needed
      })
      .addCase(dislikeCombo.fulfilled, (state, action) => {
        const { comboId, updatedCombo } = action.payload;
        
        // Ensure combos exists and is an array
        if (Array.isArray(state.combos)) {
          // Update the combo in the list
          state.combos = state.combos.map(combo => 
            combo.id === comboId 
              ? { ...combo, dislikes: updatedCombo.dislikes }
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
export const { clearCombos, toggleSortDirection } = comboListSlice.actions;

// Export selectors
export const selectCombos = state => state.comboList?.combos || [];
export const selectComboListStatus = state => state.comboList?.status || 'idle';
export const selectComboListError = state => state.comboList?.error || null;
export const selectSortDirection = state => state.comboList?.sortDirection || 'desc';

export default comboListSlice.reducer;