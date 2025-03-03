import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGames, getGameById } from '../../../services/apiService';

// Async thunk to fetch games from the API service
export const fetchGames = createAsyncThunk(
  'gameSelection/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const games = await getGames();
      return games;
    } catch (error) {
      console.error('Fetch games error:', error);
      return rejectWithValue(
        error.message || 'Failed to fetch games. Please try again.'
      );
    }
  }
);

// Async thunk to fetch a specific game by ID
export const fetchGameById = createAsyncThunk(
  'gameSelection/fetchGameById',
  async (gameId, { rejectWithValue }) => {
    try {
      const game = await getGameById(gameId);
      return game;
    } catch (error) {
      console.error(`Fetch game by ID error (${gameId}):`, error);
      return rejectWithValue(
        error.message || 'Failed to fetch game details'
      );
    }
  }
);

const initialState = {
  games: [],
  selectedGame: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const gameSelectionSlice = createSlice({
  name: 'gameSelection',
  initialState,
  reducers: {
    selectGame: (state, action) => {
      state.selectedGame = action.payload;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
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
      // Fetch games cases
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.games = []; // Clear games on error
        state.error = action.payload || 'Failed to fetch games';
      })
      
      // Fetch game by id cases
      .addCase(fetchGameById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedGame = action.payload;
        state.error = null;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedGame = null; // Clear selected game on error
        state.error = action.payload || 'Failed to fetch game details';
      });
  }
});

// Export actions
export const { 
  selectGame, 
  clearSelectedGame, 
  setError, 
  clearError 
} = gameSelectionSlice.actions;

// Selectors
export const selectGamesState = state => state.gameSelection;
export const selectGames = state => state.gameSelection.games || [];
export const selectSelectedGame = state => state.gameSelection.selectedGame;
export const selectGamesStatus = state => state.gameSelection.status;
export const selectGamesError = state => state.gameSelection.error;

export default gameSelectionSlice.reducer;