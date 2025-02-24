// features/game-selection/store/gameSelectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulated API call for games (replace with actual API call)
const fetchGamesApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: '1', 
          name: 'Street Fighter 6', 
          imageUrl: '/images/sf6.jpg',
          characters: [
            { id: '1-1', name: 'Ryu' },
            { id: '1-2', name: 'Chun-Li' },
            { id: '1-3', name: 'Ken' }
          ]
        },
        { 
          id: '2', 
          name: 'Tekken 8', 
          imageUrl: '/images/tekken8.jpg',
          characters: [
            { id: '2-1', name: 'Kazuya' },
            { id: '2-2', name: 'Jin' },
            { id: '2-3', name: 'King' }
          ]
        },
        { 
          id: '3', 
          name: 'Mortal Kombat 1', 
          imageUrl: '/images/mk1.jpg',
          characters: [
            { id: '3-1', name: 'Scorpion' },
            { id: '3-2', name: 'Sub-Zero' },
            { id: '3-3', name: 'Kitana' }
          ]
        },
      ]);
    }, 500);
  });
};

// Async thunk for fetching games
export const fetchGames = createAsyncThunk(
  'gameSelection/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const games = await fetchGamesApi();
      return games;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  games: [],
  selectedGame: null,
  isLoading: false,
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.games = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { selectGame, clearSelectedGame } = gameSelectionSlice.actions;

// Selectors
export const selectGames = (state) => state.gameSelection.games;
export const selectSelectedGame = (state) => state.gameSelection.selectedGame;
export const selectGamesLoading = (state) => state.gameSelection.isLoading;
export const selectGamesError = (state) => state.gameSelection.error;

export default gameSelectionSlice.reducer;