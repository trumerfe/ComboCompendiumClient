import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCharactersByGameId, getCharacterById } from '../../../services/apiService';

// Async thunk to fetch characters for a specific game
export const fetchCharactersByGameId = createAsyncThunk(
  'characterSelection/fetchCharactersByGameId',
  async (gameId, { rejectWithValue }) => {
    try {
      const characters = await getCharactersByGameId(gameId);
      return characters;
    } catch (error) {
      console.error(`Fetch characters error for game ${gameId}:`, error);
      return rejectWithValue(
        error.message || 'Failed to fetch characters. Please try again.'
      );
    }
  }
);

// Async thunk to fetch a specific character by ID
export const fetchCharacterById = createAsyncThunk(
  'characterSelection/fetchCharacterById',
  async (characterId, { rejectWithValue }) => {
    try {
      const character = await getCharacterById(characterId);
      return character;
    } catch (error) {
      console.error(`Fetch character by ID error (${characterId}):`, error);
      return rejectWithValue(
        error.message || 'Failed to fetch character details'
      );
    }
  }
);

const initialState = {
  characters: [],
  selectedCharacter: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const characterSelectionSlice = createSlice({
  name: 'characterSelection',
  initialState,
  reducers: {
    selectCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    },
    clearSelectedCharacter: (state) => {
      state.selectedCharacter = null;
    },
    clearCharacters: (state) => {
      state.characters = [];
      state.selectedCharacter = null;
      state.status = 'idle';
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters cases
      .addCase(fetchCharactersByGameId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharactersByGameId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Handle potential API response structures
        const characters = action.payload.data || action.payload;
        state.characters = Array.isArray(characters) ? characters : [];
        
        state.error = null;
      })
      .addCase(fetchCharactersByGameId.rejected, (state, action) => {
        state.status = 'failed';
        state.characters = []; // Clear characters on error
        state.error = action.payload || 'Failed to fetch characters';
      })
      
      // Fetch character by id cases
      .addCase(fetchCharacterById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCharacter = action.payload;
        state.error = null;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedCharacter = null; // Clear selected character on error
        state.error = action.payload || 'Failed to fetch character details';
      });
  }
});

// Export actions
export const { 
  selectCharacter, 
  clearSelectedCharacter, 
  clearCharacters,
  setError, 
  clearError 
} = characterSelectionSlice.actions;

// Selectors
export const selectCharactersState = state => state.characterSelection;
export const selectCharacters = state => state.characterSelection.characters || [];
export const selectSelectedCharacter = state => state.characterSelection.selectedCharacter;
export const selectCharactersStatus = state => state.characterSelection.status;
export const selectCharactersError = state => state.characterSelection.error;

export default characterSelectionSlice.reducer;