// src/features/characterSelection/store/characterSelectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for characters - in the future this would come from an API
const MOCK_CHARACTERS = {
  // Street Fighter 6
  1: [
    { id: 101, name: 'Ryu', imageUrl: '/characters/sf6/ryu.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Shoto' },
    { id: 102, name: 'Ken', imageUrl: '/characters/sf6/ken.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Shoto' },
    { id: 103, name: 'Chun-Li', imageUrl: '/characters/sf6/chunli.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 104, name: 'Guile', imageUrl: '/characters/sf6/guile.jpg', gameId: 1, difficulty: 'Hard', archetype: 'Zoner' },
    { id: 105, name: 'Blanka', imageUrl: '/characters/sf6/blanka.jpg', gameId: 1, difficulty: 'Easy', archetype: 'Charge' },
    { id: 106, name: 'Dhalsim', imageUrl: '/characters/sf6/dhalsim.jpg', gameId: 1, difficulty: 'Hard', archetype: 'Zoner' },
    { id: 107, name: 'Zangief', imageUrl: '/characters/sf6/zangief.jpg', gameId: 1, difficulty: 'Hard', archetype: 'Grappler' },
    { id: 108, name: 'Juri', imageUrl: '/characters/sf6/juri.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Rushdown' },
    { id: 109, name: 'Cammy', imageUrl: '/characters/sf6/cammy.jpg', gameId: 1, difficulty: 'Easy', archetype: 'Rushdown' },
    { id: 110, name: 'Luke', imageUrl: '/characters/sf6/luke.jpg', gameId: 1, difficulty: 'Easy', archetype: 'Balanced' },
    { id: 111, name: 'Kimberly', imageUrl: '/characters/sf6/kimberly.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Rushdown' },
    { id: 112, name: 'Jamie', imageUrl: '/characters/sf6/jamie.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Technical' },
    { id: 113, name: 'Marisa', imageUrl: '/characters/sf6/marisa.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Grappler' },
    { id: 114, name: 'Manon', imageUrl: '/characters/sf6/manon.jpg', gameId: 1, difficulty: 'Hard', archetype: 'Technical' },
    { id: 115, name: 'Dee Jay', imageUrl: '/characters/sf6/deejay.jpg', gameId: 1, difficulty: 'Easy', archetype: 'Balanced' },
    { id: 116, name: 'JP', imageUrl: '/characters/sf6/jp.jpg', gameId: 1, difficulty: 'Hard', archetype: 'Technical' },
    { id: 117, name: 'E. Honda', imageUrl: '/characters/sf6/ehonda.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Grappler' },
    { id: 118, name: 'Lily', imageUrl: '/characters/sf6/lily.jpg', gameId: 1, difficulty: 'Medium', archetype: 'Balanced' },
  ],
  // Tekken 8
  2: [
    { id: 201, name: 'Jin Kazama', imageUrl: '/characters/tekken8/jin.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 202, name: 'Kazuya Mishima', imageUrl: '/characters/tekken8/kazuya.jpg', gameId: 2, difficulty: 'Hard', archetype: 'Offensive' },
    { id: 203, name: 'Paul Phoenix', imageUrl: '/characters/tekken8/paul.jpg', gameId: 2, difficulty: 'Easy', archetype: 'Powerful' },
    { id: 204, name: 'King', imageUrl: '/characters/tekken8/king.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Grappler' },
    { id: 205, name: 'Lars Alexandersson', imageUrl: '/characters/tekken8/lars.jpg', gameId: 2, difficulty: 'Easy', archetype: 'Offensive' },
    { id: 206, name: 'Jack-8', imageUrl: '/characters/tekken8/jack8.jpg', gameId: 2, difficulty: 'Easy', archetype: 'Powerful' },
    { id: 207, name: 'Jun Kazama', imageUrl: '/characters/tekken8/jun.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Technical' },
    { id: 208, name: 'Ling Xiaoyu', imageUrl: '/characters/tekken8/xiaoyu.jpg', gameId: 2, difficulty: 'Hard', archetype: 'Evasive' },
    { id: 209, name: 'Asuka Kazama', imageUrl: '/characters/tekken8/asuka.jpg', gameId: 2, difficulty: 'Easy', archetype: 'Defensive' },
    { id: 210, name: 'Hwoarang', imageUrl: '/characters/tekken8/hwoarang.jpg', gameId: 2, difficulty: 'Hard', archetype: 'Technical' },
    { id: 211, name: 'Bryan Fury', imageUrl: '/characters/tekken8/bryan.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Offensive' },
    { id: 212, name: 'Claudio Serafino', imageUrl: '/characters/tekken8/claudio.jpg', gameId: 2, difficulty: 'Easy', archetype: 'Balanced' },
    { id: 213, name: 'Nina Williams', imageUrl: '/characters/tekken8/nina.jpg', gameId: 2, difficulty: 'Hard', archetype: 'Rushdown' },
    { id: 214, name: 'Yoshimitsu', imageUrl: '/characters/tekken8/yoshimitsu.jpg', gameId: 2, difficulty: 'Hard', archetype: 'Unorthodox' },
    { id: 215, name: 'Leroy Smith', imageUrl: '/characters/tekken8/leroy.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Technical' },
    { id: 216, name: 'Azucena', imageUrl: '/characters/tekken8/azucena.jpg', gameId: 2, difficulty: 'Medium', archetype: 'Balanced' },
  ],
  // Mortal Kombat 1
  4: [
    { id: 401, name: 'Scorpion', imageUrl: '/characters/mk1/scorpion.jpg', gameId: 4, difficulty: 'Easy', archetype: 'Rushdown' },
    { id: 402, name: 'Sub-Zero', imageUrl: '/characters/mk1/subzero.jpg', gameId: 4, difficulty: 'Easy', archetype: 'Balanced' },
    { id: 404, name: 'Liu Kang', imageUrl: '/characters/mk1/liukang.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 404, name: 'Kitana', imageUrl: '/characters/mk1/kitana.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Zoner' },
    { id: 405, name: 'Kung Lao', imageUrl: '/characters/mk1/kunglao.jpg', gameId: 4, difficulty: 'Hard', archetype: 'Technical' },
    { id: 406, name: 'Mileena', imageUrl: '/characters/mk1/mileena.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Rushdown' },
    { id: 407, name: 'Raiden', imageUrl: '/characters/mk1/raiden.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 408, name: 'Johnny Cage', imageUrl: '/characters/mk1/johnnycage.jpg', gameId: 4, difficulty: 'Easy', archetype: 'Rushdown' },
    { id: 409, name: 'Sonya Blade', imageUrl: '/characters/mk1/sonyablade.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 410, name: 'Smoke', imageUrl: '/characters/mk1/smoke.jpg', gameId: 4, difficulty: 'Hard', archetype: 'Technical' },
    { id: 411, name: 'Reptile', imageUrl: '/characters/mk1/reptile.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Balanced' },
    { id: 412, name: 'Rain', imageUrl: '/characters/mk1/rain.jpg', gameId: 4, difficulty: 'Hard', archetype: 'Technical' },
    { id: 413, name: 'Baraka', imageUrl: '/characters/mk1/baraka.jpg', gameId: 4, difficulty: 'Easy', archetype: 'Rushdown' },
    { id: 414, name: 'Geras', imageUrl: '/characters/mk1/geras.jpg', gameId: 4, difficulty: 'Hard', archetype: 'Powerful' },
    { id: 415, name: 'Tanya', imageUrl: '/characters/mk1/tanya.jpg', gameId: 4, difficulty: 'Medium', archetype: 'Technical' },
  ]
};

// Async thunk for fetching characters based on selected game
export const fetchCharacters = createAsyncThunk(
  'characterSelection/fetchCharacters',
  async (gameId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Check if we have characters for this game
      if (MOCK_CHARACTERS[gameId]) {
        return MOCK_CHARACTERS[gameId];
      } else {
        return rejectWithValue('No characters found for this game');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load characters');
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load characters';
      });
  }
});

// Export actions
export const { 
  selectCharacter, 
  clearSelectedCharacter, 
  setError,
  clearCharacters
} = characterSelectionSlice.actions;

// Export selectors
export const selectCharacters = state => state.characterSelection.characters;
export const selectSelectedCharacter = state => state.characterSelection.selectedCharacter;
export const selectCharactersStatus = state => state.characterSelection.status;
export const selectCharactersError = state => state.characterSelection.error;

export default characterSelectionSlice.reducer;