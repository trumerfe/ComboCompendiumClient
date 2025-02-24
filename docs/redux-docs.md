# Redux Implementation Guide

## Overview
This document details the Redux implementation in our React application, covering store configuration, slice patterns, and best practices for state management.

## Store Structure
The Redux store follows a feature-based architecture with the following structure:

```
store/
├── index.js           # Store configuration
└── rootReducer.js     # Combined reducers
features/
└── [feature-name]/
    └── store/
        └── [feature]Slice.js
```

### Store Configuration
The main store is configured using Redux Toolkit's `configureStore`:

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

### Root Reducer
The root reducer combines all feature reducers:

```javascript
// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../features/app/store/appSlice';
import gameSelectionReducer from '../features/game-selection/store/gameSelectionSlice';

const rootReducer = combineReducers({
  app: appReducer,
  gameSelection: gameSelectionReducer,
});

export default rootReducer;
```

## Feature Slices

### Slice Pattern
Each feature has its own Redux slice following this pattern:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Feature-specific state
};

const featureSlice = createSlice({
  name: 'featureName',
  initialState,
  reducers: {
    // Action creators
  },
  extraReducers: (builder) => {
    // Handle async actions
  }
});

export const { actions } = featureSlice;
export default featureSlice.reducer;
```

### Example Slices

#### App Slice
```javascript
// features/app/store/appSlice.js
const appSlice = createSlice({
  name: 'app',
  initialState: {
    theme: 'light',
    isLoading: false
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});
```

#### Game Selection Slice
```javascript
// features/game-selection/store/gameSelectionSlice.js
const initialState = {
  games: [],
  selectedGame: null,
  selectedCharacter: null,
  error: null
};

const gameSelectionSlice = createSlice({
  name: 'gameSelection',
  initialState,
  reducers: {
    selectGame: (state, action) => {
      state.selectedGame = action.payload;
      state.selectedCharacter = null;
    },
    selectCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    }
  }
});
```

## Using Redux in Components

### Hooks
Use Redux hooks for accessing store state and dispatching actions:

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectGame } from './store/gameSelectionSlice';

const GameSelection = () => {
  const dispatch = useDispatch();
  const selectedGame = useSelector(state => state.gameSelection.selectedGame);

  const handleGameSelect = (game) => {
    dispatch(selectGame(game));
  };
};
```

### Selectors
Create and use selectors for accessing state:

```javascript
// selectors.js
export const selectGames = state => state.gameSelection.games;
export const selectSelectedGame = state => state.gameSelection.selectedGame;

// Component
const games = useSelector(selectGames);
```

## Best Practices

1. **State Shape**
   - Keep state normalized
   - Avoid deeply nested state
   - Use IDs for relationships

2. **Action Creators**
   - Use meaningful action names
   - Keep payload data minimal
   - Use prepare callback for complex actions

3. **Selectors**
   - Memoize complex selectors with `createSelector`
   - Keep selectors colocated with reducers
   - Use reselect for derived data

4. **Async Actions**
   - Use Redux Toolkit's `createAsyncThunk`
   - Handle loading and error states
   - Use proper error boundaries

## Adding New State

1. Create a new slice file in the feature directory
2. Define initial state and reducers
3. Add to root reducer
4. Create selectors
5. Use in components

Example:
```javascript
// features/combo-builder/store/comboBuilderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCombo: [],
  savedCombos: [],
};

const comboBuilderSlice = createSlice({
  name: 'comboBuilder',
  initialState,
  reducers: {
    addMove: (state, action) => {
      state.currentCombo.push(action.payload);
    },
    saveCombo: (state) => {
      state.savedCombos.push([...state.currentCombo]);
      state.currentCombo = [];
    }
  }
});

export const { addMove, saveCombo } = comboBuilderSlice.actions;
export default comboBuilderSlice.reducer;
```