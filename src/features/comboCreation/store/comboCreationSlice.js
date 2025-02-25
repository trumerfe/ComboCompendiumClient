import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getGameNotation, 
  getNotationDataForComboBuilder,
  createCombo 
} from '../../../services/mockDataService';
import { COMBO_TAGS, DEFAULT_COMBO_VALUES } from '../../../constants/comboConstants';

// Async thunks
export const fetchNotationData = createAsyncThunk(
  'comboCreation/fetchNotationData',
  async ({ gameId, characterId }, { rejectWithValue }) => {
    try {
      const notationData = await getNotationDataForComboBuilder(gameId, characterId);
      return notationData;
    } catch (error) {
      console.error('Error fetching notation data:', error);
      return rejectWithValue(error.message || 'Failed to fetch notation data');
    }
  }
);

export const saveCombo = createAsyncThunk(
  'comboCreation/saveCombo',
  async (comboData, { rejectWithValue }) => {
    try {
      const newCombo = await createCombo(comboData);
      return newCombo;
    } catch (error) {
      console.error('Error saving combo:', error);
      return rejectWithValue(error.message || 'Failed to save combo');
    }
  }
);

const initialState = {
  gameId: null,
  characterId: null,
  notationData: null,              // Available notation elements
  comboSequence: [],               // The ordered array of chosen elements
  comboName: '',                   // User entered combo name
  comboDamage: DEFAULT_COMBO_VALUES.damage.toString(),
  comboDifficulty: DEFAULT_COMBO_VALUES.difficulty,
  comboTags: [...DEFAULT_COMBO_VALUES.tags],
  comboDescription: '',            // User entered description
  comboVideo: '',                  // Optional video URL
  availableTags: COMBO_TAGS,       // Available tags from constants
  status: 'idle',                  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,                     // Error message or null
  savedCombo: null                 // The saved combo after submission
};

const comboCreationSlice = createSlice({
  name: 'comboCreation',
  initialState,
  reducers: {
    setGameAndCharacter: (state, action) => {
      state.gameId = action.payload.gameId;
      state.characterId = action.payload.characterId;
    },
    
    addElementToSequence: (state, action) => {
      state.comboSequence.push(action.payload);
    },
    
    removeElementFromSequence: (state, action) => {
      state.comboSequence.splice(action.payload.index, 1);
    },
    
    reorderComboSequence: (state, action) => {
      // Expecting payload to have { oldIndex, newIndex }
      const { oldIndex, newIndex } = action.payload;
      
      // Remove element from old position and insert at new position
      const [movedElement] = state.comboSequence.splice(oldIndex, 1);
      state.comboSequence.splice(newIndex, 0, movedElement);
    },
    
    clearComboSequence: (state) => {
      state.comboSequence = [];
    },
    
    updateComboName: (state, action) => {
      state.comboName = action.payload;
    },
    
    updateComboDamage: (state, action) => {
      state.comboDamage = action.payload;
    },
    
    updateComboDifficulty: (state, action) => {
      state.comboDifficulty = action.payload;
    },
    
    updateComboDescription: (state, action) => {
      state.comboDescription = action.payload;
    },
    
    updateComboVideo: (state, action) => {
      state.comboVideo = action.payload;
    },
    
    addComboTag: (state, action) => {
      if (!state.comboTags.includes(action.payload)) {
        state.comboTags.push(action.payload);
      }
    },
    
    removeComboTag: (state, action) => {
      state.comboTags = state.comboTags.filter(tag => tag !== action.payload);
    },
    
    resetComboCreation: (state) => {
      return {
        ...initialState,
        gameId: state.gameId,
        characterId: state.characterId,
        notationData: state.notationData,
        availableTags: state.availableTags
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchNotationData
      .addCase(fetchNotationData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotationData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notationData = action.payload;
      })
      .addCase(fetchNotationData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle saveCombo
      .addCase(saveCombo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveCombo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedCombo = action.payload;
      })
      .addCase(saveCombo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Actions
export const {
  setGameAndCharacter,
  addElementToSequence,
  removeElementFromSequence,
  reorderComboSequence,
  clearComboSequence,
  updateComboName,
  updateComboDamage,
  updateComboDifficulty,
  updateComboDescription,
  updateComboVideo,
  addComboTag,
  removeComboTag,
  resetComboCreation
} = comboCreationSlice.actions;

// Selectors
export const selectComboCreationStatus = state => state.comboCreation.status;
export const selectComboCreationError = state => state.comboCreation.error;
export const selectNotationData = state => state.comboCreation.notationData;
export const selectComboSequence = state => state.comboCreation.comboSequence;
export const selectComboDetails = state => ({
  name: state.comboCreation.comboName,
  damage: state.comboCreation.comboDamage,
  difficulty: state.comboCreation.comboDifficulty,
  tags: state.comboCreation.comboTags,
  description: state.comboCreation.comboDescription,
  video: state.comboCreation.comboVideo
});
export const selectAvailableTags = state => state.comboCreation.availableTags;
export const selectSavedCombo = state => state.comboCreation.savedCombo;

export default comboCreationSlice.reducer;