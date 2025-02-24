# Combo Compendium - Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Core Technologies](#core-technologies)
- [Application Foundation](#application-foundation)
  - [Entry Point](#entry-point)
  - [App Component](#app-component)
  - [Error Handling](#error-handling)
  - [State Management](#state-management)
  - [Styling System](#styling-system)
- [Feature Architecture](#feature-architecture)
  - [Feature Directory Structure](#feature-directory-structure)
  - [Components](#components)
  - [Pages](#pages)
  - [Store (Redux)](#store-redux)
  - [Hooks](#hooks)
- [Styling Guidelines](#styling-guidelines)
  - [BEM Methodology](#bem-methodology)
  - [CSS Variables](#css-variables)
  - [Responsive Design](#responsive-design)
- [Best Practices](#best-practices)
  - [Error Handling](#error-handling-1)
  - [Component Design](#component-design)
  - [State Management](#state-management-1)
- [Example Features](#example-features)
  - [Game Selection](#game-selection)
  - [Character Selection](#character-selection)

## Overview

This application is a combo compendium for fighting games, allowing users to browse games, characters, and combos. It follows a feature-based architecture with a clear separation of concerns, using Redux for state management and SCSS with BEM methodology for styling.

## Directory Structure

```
src_new/
├── components/                # Global shared components
│   └── ErrorBoundary/
│       ├── ErrorBoundary.jsx
│       ├── ErrorBoundary.scss
│       └── index.js
├── features/                  # Feature-based modules
│   ├── gameSelection/
│   │   ├── components/        # Feature-specific components
│   │   ├── pages/             # Feature pages for routing
│   │   ├── store/             # Redux slice
│   │   ├── hooks/             # Custom hooks
│   │   └── index.js           # Public exports
│   └── [other features]/
├── hooks/                     # Global hooks
│   └── useErrorHandler.js
├── store/                     # Redux store configuration
│   ├── index.js
│   └── rootReducer.js
├── styles/                    # Global styling
│   └── main.scss
├── App.jsx                    # Main app component
└── main.jsx                   # Entry point
```

## Core Technologies

- **React** - UI library for building component-based interfaces
- **Redux Toolkit** - State management with simplified setup and boilerplate
- **React Router** - Client-side routing between different views
- **SCSS/Sass** - CSS preprocessor for structured styling
- **React Error Boundary** - Component error handling
- **React Toastify** - User-friendly notifications

## Application Foundation

### Entry Point

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

The entry point wraps the application with React Router and loads the main stylesheet.

### App Component

```jsx
// App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import { GameSelectionPage } from './features/gameSelection';
// ... other feature imports

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <div className="app">
          {/* Sidebar */}
          <main className="app__main">
            <Routes>
              <Route path="/" element={<GameSelectionPage />} />
              {/* Other routes */}
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </ErrorBoundary>
    </Provider>
  );
};
```

The App component sets up:
- Redux Provider for state management
- Error Boundary for error handling
- React Router for navigation
- Toast Container for notifications

### Error Handling

#### Error Boundary

```jsx
// components/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      {/* Error UI */}
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const handleError = (error, info) => {
    // Log error
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.href = '/'}
    >
      {children}
    </ReactErrorBoundary>
  );
};
```

#### Error Handler Hook

```jsx
// hooks/useErrorHandler.js
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useErrorHandler = () => {
  const handleError = useCallback((error, options = {}) => {
    console.error('Error:', error);
    
    const {
      title = 'Error',
      fallbackMessage = 'An unexpected error occurred',
      showToast = true,
      logToService = true,
    } = options;
    
    if (showToast) {
      toast.error(error.message || fallbackMessage);
    }
    
    // Additional logging logic
    
    return error.message || fallbackMessage;
  }, []);
  
  return { handleError };
};
```

Use this hook in components to handle errors consistently:

```jsx
const MyComponent = () => {
  const { handleError } = useErrorHandler();
  
  const handleSubmit = async () => {
    try {
      // Async operation
    } catch (error) {
      handleError(error, { 
        title: 'Submission Failed',
        fallbackMessage: 'Could not save your data'
      });
    }
  };
};
```

### State Management

#### Store Configuration

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
```

#### Root Reducer

```jsx
// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import gameSelectionReducer from '../features/gameSelection/store/gameSelectionSlice';
// Import other feature reducers

const rootReducer = combineReducers({
  gameSelection: gameSelectionReducer,
  // Other feature reducers
});

export default rootReducer;
```

### Styling System

The application uses SCSS with BEM methodology and CSS variables for consistent theming.

```scss
// styles/main.scss
:root {
  // Colors
  --primary-color: #3b82f6;
  --primary-color-dark: #2563eb;
  --card-bg: #ffffff;
  --bg-primary: #f9fafb;
  --bg-secondary: #f3f4f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --color-error: #ef4444;
  --color-success: #10b981;
  
  // Spacing
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
}

// Reset and base styles
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}
```

## Feature Architecture

Each feature follows a consistent structure for maintainability and separation of concerns.

### Feature Directory Structure

```
features/gameSelection/
├── components/              # UI components
│   └── GameCard/
│       ├── GameCard.jsx
│       ├── GameCard.scss
│       └── index.js
├── pages/                   # Pages for routing
│   └── GameSelectionPage/
│       ├── GameSelectionPage.jsx
│       ├── GameSelectionPage.scss
│       └── index.js
├── store/                   # Redux store slice
│   └── gameSelectionSlice.js
├── hooks/                   # Custom hooks
│   └── useGameSelection.js
└── index.js                 # Public exports
```

### Components

Components should follow a single responsibility principle and be reusable when possible.

```jsx
// features/gameSelection/components/GameCard/GameCard.jsx
import React from 'react';
import './GameCard.scss';

const GameCard = ({ game, onSelect }) => {
  return (
    <div 
      className="game-card"
      onClick={() => onSelect(game)}
    >
      <div className="game-card__image-container">
        <img src={game.imageUrl} alt={game.name} className="game-card__image" />
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
      </div>
    </div>
  );
};

export default GameCard;
```

### Pages

Pages compose components and handle routing concerns.

```jsx
// features/gameSelection/pages/GameSelectionPage/GameSelectionPage.jsx
import React from 'react';
import GameSelection from '../../components/GameSelection';
import './GameSelectionPage.scss';

const GameSelectionPage = () => {
  return (
    <div className="game-selection-page">
      <header className="game-selection-page__header">
        <h1 className="game-selection-page__title">Choose Your Game</h1>
      </header>
      <GameSelection />
    </div>
  );
};

export default GameSelectionPage;
```

### Store (Redux)

Each feature has its own Redux slice for state management.

```jsx
// features/gameSelection/store/gameSelectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
    setGames: (state, action) => {
      state.games = action.payload;
    },
    selectGame: (state, action) => {
      state.selectedGame = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setGames, selectGame, setLoading, setError } = gameSelectionSlice.actions;

// Selectors
export const selectGames = state => state.gameSelection.games;
export const selectSelectedGame = state => state.gameSelection.selectedGame;
export const selectGamesLoading = state => state.gameSelection.isLoading;
export const selectGamesError = state => state.gameSelection.error;

export default gameSelectionSlice.reducer;
```

### Hooks

Custom hooks encapsulate complex logic and state management for better reusability.

```jsx
// features/gameSelection/hooks/useGameSelection.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectGames, selectSelectedGame, selectGamesLoading, selectGamesError,
  setGames, selectGame, setLoading, setError
} from '../store/gameSelectionSlice';
import { useErrorHandler } from '../../../hooks/useErrorHandler';

export const useGameSelection = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorHandler();
  const games = useSelector(selectGames);
  const selectedGame = useSelector(selectSelectedGame);
  const isLoading = useSelector(selectGamesLoading);
  const error = useSelector(selectGamesError);

  const loadGames = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      // API call
      const gamesData = await fetchGames();
      dispatch(setGames(gamesData));
    } catch (err) {
      const errorMsg = handleError(err);
      dispatch(setError(errorMsg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, handleError]);

  useEffect(() => {
    if (games.length === 0) {
      loadGames();
    }
  }, [games.length, loadGames]);

  return {
    games,
    selectedGame,
    isLoading,
    error,
    selectGame: (game) => dispatch(selectGame(game)),
    reloadGames: loadGames
  };
};
```

## Styling Guidelines

### BEM Methodology

The application follows BEM (Block Element Modifier) methodology for CSS class naming:

```scss
.block {
  // Block styles
  
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
```

Example:

```scss
.game-card {
  background-color: var(--card-bg);
  
  &__image {
    width: 100%;
  }
  
  &--selected {
    border: 2px solid var(--primary-color);
  }
}
```

### CSS Variables

Use CSS variables for consistent theming:

```scss
.button {
  background-color: var(--primary-color);
  padding: var(--spacing-2) var(--spacing-4);
}

.button--secondary {
  background-color: var(--color-secondary);
}
```

### Responsive Design

Use media queries for responsive layouts:

```scss
.game-selection__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Best Practices

### Error Handling

1. **Use Error Boundaries** for component errors
2. **Use try/catch** for async operations
3. **Use the error handler hook** for consistent error handling
4. **Show user-friendly error messages** via toast notifications
5. **Log errors** for debugging and monitoring

### Component Design

1. **Single Responsibility Principle** - Each component should do one thing well
2. **Composition Over Inheritance** - Build complex UIs by composing smaller components
3. **Container/Presentational Pattern** - Separate logic from presentation
4. **Props Interface** - Clearly define expected props
5. **Defaults** - Provide sensible default values for props

### State Management

1. **Feature-Based Slices** - Organize Redux by feature
2. **Normalized State** - Avoid deeply nested state objects
3. **Selectors** - Use selectors to access state
4. **Action Naming** - Use clear, descriptive action names
5. **Side Effects** - Handle side effects in hooks or thunks

## Example Features

### Game Selection

The Game Selection feature allows users to browse and select from available fighting games.

**State Structure:**
```javascript
{
  games: [
    { id: 1, name: 'Street Fighter 6', imageUrl: '...' },
    // ...more games
  ],
  selectedGame: null,
  isLoading: false,
  error: null
}
```

**Component Hierarchy:**
```
GameSelectionPage
└── GameSelection
    └── GameCard (multiple)
```

**User Flow:**
1. User navigates to home page
2. Games are loaded from API
3. User selects a game
4. App navigates to character selection with selected game

### Character Selection

The Character Selection feature displays characters for the selected game and allows users to select a character.

**State Structure:**
```javascript
{
  characters: [
    { id: 1, name: 'Ryu', gameId: 1, imageUrl: '...' },
    // ...more characters
  ],
  selectedCharacter: null,
  isLoading: false,
  error: null
}
```

**Component Hierarchy:**
```
CharacterSelectionPage
└── CharacterSelection
    └── CharacterCard (multiple)
```

**User Flow:**
1. User navigates to character selection page
2. Characters for selected game are loaded
3. User selects a character
4. App navigates to combo list with selected character
