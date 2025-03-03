import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCombosByCharacterId, 
  likeCombo as likeComboService,
  dislikeCombo as dislikeComboService
} from '../../../services/apiService';

// Helper function to safely sort combos by likes
const sortCombosByLikes = (combos = [], direction = 'desc') => {
  if (!Array.isArray(combos)) return [];
  
  return [...combos].sort((a, b) => {
    // Updated to handle likes as arrays instead of numbers
    const aLikes = a?.likes?.length || 0;
    const bLikes = b?.likes?.length || 0;
    const comparison = aLikes - bLikes;
    // Fix sort direction logic: 'asc' should show lowest first, 'desc' highest first
    return direction === 'asc' ? comparison : -comparison;
  });
};

// Helper function to filter combos by difficulty and tags
const filterCombos = (combos = [], filters = {}) => {
  if (!Array.isArray(combos)) return [];
  
  return combos.filter(combo => {
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all' && combo.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      // If combo has no tags or is missing some of the required tags, filter it out
      if (!combo.tags || !Array.isArray(combo.tags)) return false;
      
      // Check if combo has all selected tags (AND logic)
      return filters.tags.every(tag => combo.tags.includes(tag));
    }
    
    return true;
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
      
      // Get combos using the API service
      const response = await getCombosByCharacterId(characterId, {
        sortBy: 'likes',
        sortDirection
      });
      
      // Handle API response format
      if (response.success) {
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
    allCombos: [], // Store all unfiltered combos
    combos: [], // Store filtered combos
    sortBy: 'likes', // Default sort by likes
    sortDirection: 'desc', // Default sort direction is descending (most likes first)
    filters: {
      difficulty: 'all',
      tags: []
    },
    status: 'idle',
    error: null
  },
  reducers: {
    clearCombos: (state) => {
      state.allCombos = [];
      state.combos = [];
      state.status = 'idle';
      state.error = null;
      // Reset filters
      state.filters = {
        difficulty: 'all',
        tags: []
      };
    },
    
    // Add a reducer to change sort direction
    toggleSortDirection: (state) => {
      // Toggle between ascending and descending
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      
      // Re-sort the filtered combos
      state.combos = sortCombosByLikes(state.combos, state.sortDirection);
    },
    
    // Add a reducer to update a combo (for like/dislike actions)
    updateCombo: (state, action) => {
      // Update in allCombos array
      if (Array.isArray(state.allCombos)) {
        const index = state.allCombos.findIndex(combo => combo.id === action.payload.id);
        if (index !== -1) {
          state.allCombos[index] = action.payload;
        }
      }
      
      // Update in filtered combos array
      if (Array.isArray(state.combos)) {
        const index = state.combos.findIndex(combo => combo.id === action.payload.id);
        if (index !== -1) {
          state.combos[index] = action.payload;
          
          // Re-sort combos
          state.combos = sortCombosByLikes(state.combos, state.sortDirection);
        }
      }
    },
    
    // Add filter reducers
    setDifficultyFilter: (state, action) => {
      state.filters.difficulty = action.payload;
      
      // Apply filters
      state.combos = filterCombos(state.allCombos, state.filters);
      
      // Apply sort
      state.combos = sortCombosByLikes(state.combos, state.sortDirection);
    },
    
    addTagFilter: (state, action) => {
      // Only add if not already in the array
      if (!state.filters.tags.includes(action.payload)) {
        state.filters.tags.push(action.payload);
        
        // Apply filters
        state.combos = filterCombos(state.allCombos, state.filters);
        
        // Apply sort
        state.combos = sortCombosByLikes(state.combos, state.sortDirection);
      }
    },
    
    removeTagFilter: (state, action) => {
      state.filters.tags = state.filters.tags.filter(tag => tag !== action.payload);
      
      // Apply filters
      state.combos = filterCombos(state.allCombos, state.filters);
      
      // Apply sort
      state.combos = sortCombosByLikes(state.combos, state.sortDirection);
    },
    
    clearTagFilters: (state) => {
      state.filters.tags = [];
      
      // Apply filters
      state.combos = filterCombos(state.allCombos, {
        ...state.filters,
        tags: []
      });
      
      // Apply sort
      state.combos = sortCombosByLikes(state.combos, state.sortDirection);
    },
    
    clearAllFilters: (state) => {
      state.filters = {
        difficulty: 'all',
        tags: []
      };
      
      // Reset to all combos
      state.combos = [...state.allCombos];
      
      // Apply sort
      state.combos = sortCombosByLikes(state.combos, state.sortDirection);
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
        
        // Store all unfiltered combos
        state.allCombos = combos;
        
        // Apply current filters
        state.combos = filterCombos(combos, state.filters);
        
        // Apply sort
        state.combos = sortCombosByLikes(state.combos, state.sortDirection);
        state.error = null;
      })
      .addCase(fetchCombosByCharacterId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
        state.allCombos = []; // Reset combos to empty array on error
        state.combos = [];
      })
      
      // Like combo cases
      .addCase(likeCombo.fulfilled, (state, action) => {
        // We now get the full updated combo from the API
        const updatedCombo = action.payload;
        
        // Update in allCombos
        if (Array.isArray(state.allCombos)) {
          state.allCombos = state.allCombos.map(combo => 
            combo.id === updatedCombo.id ? updatedCombo : combo
          );
        }
        
        // Update in filtered combos if it exists there
        if (Array.isArray(state.combos)) {
          const comboExists = state.combos.some(combo => combo.id === updatedCombo.id);
          
          if (comboExists) {
            state.combos = state.combos.map(combo => 
              combo.id === updatedCombo.id ? updatedCombo : combo
            );
            
            // Re-sort by likes
            state.combos = sortCombosByLikes(state.combos, state.sortDirection);
          }
        }
      })
      .addCase(likeCombo.rejected, (state, action) => {
        state.error = action.payload || 'Failed to like combo';
      })
      
      // Dislike combo cases
      .addCase(dislikeCombo.fulfilled, (state, action) => {
        // We now get the full updated combo from the API
        const updatedCombo = action.payload;
        
        // Update in allCombos
        if (Array.isArray(state.allCombos)) {
          state.allCombos = state.allCombos.map(combo => 
            combo.id === updatedCombo.id ? updatedCombo : combo
          );
        }
        
        // Update in filtered combos if it exists there
        if (Array.isArray(state.combos)) {
          const comboExists = state.combos.some(combo => combo.id === updatedCombo.id);
          
          if (comboExists) {
            state.combos = state.combos.map(combo => 
              combo.id === updatedCombo.id ? updatedCombo : combo
            );
          }
        }
      })
      .addCase(dislikeCombo.rejected, (state, action) => {
        state.error = action.payload || 'Failed to dislike combo';
      });
  }
});

// Export actions
export const { 
  clearCombos, 
  toggleSortDirection, 
  updateCombo,
  setDifficultyFilter,
  addTagFilter,
  removeTagFilter,
  clearTagFilters,
  clearAllFilters
} = comboListSlice.actions;

// Export selectors
export const selectAllCombos = state => state.comboList?.allCombos || [];
export const selectCombos = state => state.comboList?.combos || [];
export const selectComboListStatus = state => state.comboList?.status || 'idle';
export const selectComboListError = state => state.comboList?.error || null;
export const selectSortDirection = state => state.comboList?.sortDirection || 'desc';
export const selectFilters = state => state.comboList?.filters || { difficulty: 'all', tags: [] };

export default comboListSlice.reducer;