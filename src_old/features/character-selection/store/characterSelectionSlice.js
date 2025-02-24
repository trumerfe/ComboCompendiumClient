// features/character-selection/store/characterSelectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulated API call for characters (replace with actual API call)
const fetchCharactersApi = (gameId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data for different games
      const charactersMap = {
        '1': [ // Street Fighter 6
          { id: 'sf1', name: 'Ryu', imageUrl: '/images/characters/ryu.jpg' },
          { id: 'sf2', name: 'Chun-Li', imageUrl: '/images/characters/chunli.jpg' },
          { id: 'sf3', name: 'Ken', imageUrl: '/images/characters/ken.jpg' },
        ],
        '2': [ // Tekken 8
          { id: 'tk1', name: 'Jin', imageUrl: '/images/characters/jin.jpg' },
          { id: 'tk2', name: 'Kazuya', imageUrl: '/images/characters/kazuya.jpg' },
          { id: 'tk3', name: 'Heihachi', imageUrl: '/images/characters/heihachi.jpg' },
        ],
        '3': [ // Mortal Kombat 1
          { id: 'mk1', name: 'Scorpion', imageUrl: '/images/characters/scorpion.jpg' },
          { id: 'mk2', name: 'Sub-Zero', imageUrl: '/images/characters/subzero.jpg' },
          { id: 'mk3', name: 'Raiden', imageUrl: '/images/characters/raiden.jpg' },
        ]
      };
      
      resolve(charactersMap[gameId] || []);
    }, 500);
  });
};

// Async thunk for fetching characters
export const fetchCharacters = createAsyncThunk(
  'characterSelection/fetchCharacters',
  async (gameId, { rejectWithValue }) => {
    try {
      if (!gameId) {
        return [];
      }
      const characters = await fetchCharactersApi(gameId);
      return characters;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  characters: [],
  selectedCharacter: null,
  isLoading: false,
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.characters = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { selectCharacter, clearSelectedCharacter, clearCharacters } = characterSelectionSlice.actions;

// Selectors
export const selectCharacters = (state) => state.characterSelection.characters;
export const selectSelectedCharacter = (state) => state.characterSelection.selectedCharacter;
export const selectCharactersLoading = (state) => state.characterSelection.isLoading;
export const selectCharactersError = (state) => state.characterSelection.error;

export default characterSelectionSlice.reducer;