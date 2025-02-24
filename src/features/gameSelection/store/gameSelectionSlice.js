// src/features/gameSelection/store/gameSelectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample game data - to be replaced with API call later
const gamesData = [
  {
    id: 1,
    name: "Street Fighter 6",
    imageUrl: "/images/games/sf6.jpg",
    developer: "Capcom",
    releaseYear: 2023,
    platform: "Multi-platform"
  },
  {
    id: 2,
    name: "Tekken 8",
    imageUrl: "/images/games/tekken8.jpg",
    developer: "Bandai Namco",
    releaseYear: 2023,
    platform: "Multi-platform"
  },
  {
    id: 3,
    name: "Guilty Gear Strive",
    imageUrl: "/images/games/ggstrive.jpg",
    developer: "Arc System Works",
    releaseYear: 2021,
    platform: "Multi-platform"
  },
  {
    id: 4,
    name: "Mortal Kombat 1",
    imageUrl: "/images/games/mk1.jpg",
    developer: "NetherRealm Studios",
    releaseYear: 2023,
    platform: "Multi-platform"
  },
  {
    id: 5,
    name: "King of Fighters XV",
    imageUrl: "/images/games/kof15.jpg",
    developer: "SNK",
    releaseYear: 2022,
    platform: "Multi-platform"
  },
  {
    id: 6,
    name: "Dragon Ball FighterZ",
    imageUrl: "/images/games/dbfz.jpg",
    developer: "Arc System Works",
    releaseYear: 2018,
    platform: "Multi-platform"
  }
];

// Async thunk to simulate fetching games from an API
export const fetchGames = createAsyncThunk(
  'gameSelection/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // This will be replaced with actual API call in the future
      return gamesData;
    } catch (error) {
      return rejectWithValue('Failed to fetch games. Please try again.');
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  }
});

// Export actions
export const { selectGame, clearSelectedGame, setError } = gameSelectionSlice.actions;

// Selectors
export const selectGamesState = state => state.gameSelection;
export const selectGames = state => state.gameSelection.games;
export const selectSelectedGame = state => state.gameSelection.selectedGame;
export const selectGamesStatus = state => state.gameSelection.status;
export const selectGamesError = state => state.gameSelection.error;

export default gameSelectionSlice.reducer;