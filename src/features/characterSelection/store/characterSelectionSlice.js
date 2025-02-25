// src/features/characterSelection/store/characterSelectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCharactersByGameId, 
  getCharacterById 
} from '../../../services/mockDataService';

// Async thunk for fetching characters based on selected game
export const fetchCharactersByGameId = createAsyncThunk(
  'characterSelection/fetchCharactersByGameId',
  async (gameId, { rejectWithValue }) => {
    try {
      const characters = await getCharactersByGameId(gameId);
      if (!characters || characters.length === 0) {
        throw new Error(`No characters found for game ID: ${gameId}`);
      }
      return characters;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load characters');
    }
  }
);

// Async thunk for fetching a specific character by ID
export const fetchCharacterById = createAsyncThunk(
  'characterSelection/fetchCharacterById',
  async (characterId, { rejectWithValue }) => {
    try {
      const character = await getCharacterById(characterId);
      if (!character) {
        throw new Error(`Character with ID ${characterId} not found`);
      }
      return character;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch character details');
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
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearCharacters: (state) => {
      state.characters = [];
      state.selectedCharacter = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters by game ID cases
      .addCase(fetchCharactersByGameId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharactersByGameId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload;
        state.error = null;
      })
      .addCase(fetchCharactersByGameId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load characters';
      })
      
      // Fetch character by ID cases
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
        state.error = action.payload || 'Failed to fetch character details';
      });
  }
});

// Export actions
export const { 
  selectCharacter, 
  clearSelectedCharacter, 
  setError,
  clearCharacters,
  clearError
} = characterSelectionSlice.actions;

// Export selectors
export const selectCharacters = state => state.characterSelection.characters;
export const selectSelectedCharacter = state => state.characterSelection.selectedCharacter;
export const selectCharactersStatus = state => state.characterSelection.status;
export const selectCharactersError = state => state.characterSelection.error;

export default characterSelectionSlice.reducer;