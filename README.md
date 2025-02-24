# Project Documentation

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Styling Architecture](#styling-architecture)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Development Guidelines](#development-guidelines)
- [Feature Documentation](#feature-documentation)

## Overview
This is a modern React application built with a feature-based architecture, utilizing Redux for state management, SCSS for styling with BEM methodology, and comprehensive error handling. The application serves as a combo compendium for fighting games, allowing users to select games and characters, and build combos using a drag-and-drop interface.

## Tech Stack
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **SASS/SCSS** - Styling
- **React Toastify** - Toast notifications
- **React Error Boundary** - Error handling
- **Vite** - Build tool and development server

## Project Structure
```
src/
├── features/           # Feature-based modules
│   ├── app/           # App-wide feature
│   │   ├── components/
│   │   │   └── App/
│   │   │       ├── App.jsx
│   │   │       ├── App.scss
│   │   │       └── index.js
│   │   └── store/
│   │       └── appSlice.js
│   └── game-selection/ # Game selection feature
│       ├── components/
│       │   └── GameSelection/
│       │       ├── GameSelection.jsx
│       │       ├── GameSelection.scss
│       │       └── index.js
│       └── store/
│           └── gameSelectionSlice.js
├── components/         # Shared components
│   ├── Layout/
│   │   └── Layout.jsx
│   └── ErrorBoundary/
│       └── ErrorFallback.jsx
├── store/             # Redux store configuration
│   ├── index.js       # Store configuration
│   └── rootReducer.js # Combined reducers
├── styles/            # Global styling system
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _functions.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _grid.scss
│   └── main.scss
├── utils/             # Shared utilities
└── App.jsx            # Root App component
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps
```bash
# Create new project
npm create vite@latest my-project -- --template react
cd my-project

# Install dependencies
npm install @reduxjs/toolkit react-redux sass react-router-dom
npm install react-toastify react-error-boundary

# Start development server
npm run dev
```

## Styling Architecture

### SCSS Structure
The styling system is organized into several layers:

1. **Abstracts**
   - `_variables.scss`: Global variables
   ```scss
   :root {
     --primary-color: #3b82f6;
     --card-bg: #ffffff;
     --text-primary: #1f2937;
     --text-secondary: #6b7280;
   }

   $breakpoint-mobile: 640px;
   $breakpoint-tablet: 768px;
   $breakpoint-desktop: 1024px;
   ```

   - `_mixins.scss`: Reusable mixins
   ```scss
   @mixin responsive($breakpoint) {
     @if $breakpoint == mobile {
       @media (max-width: $breakpoint-mobile) { @content; }
     }
     // ... other breakpoints
   }
   ```

2. **Base**
   - `_reset.scss`: CSS reset
   - `_typography.scss`: Typography rules
   - `_grid.scss`: Grid system

### BEM Methodology
We follow BEM (Block Element Modifier) naming convention:
```scss
.block {
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
```

## State Management

### Store Configuration
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
```javascript
// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../features/app/store/appSlice';
import gameSelectionReducer from '../features/game-selection/store/gameSelectionSlice';

const rootReducer = combineReducers({
  app: appReducer,
  gameSelection: gameSelectionReducer,
});
```

### Feature Slices

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
  games: INITIAL_GAMES_DATA,
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
    },
    setGames: (state, action) => {
      state.games = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});
```

## Error Handling

### Global Error Boundary
```javascript
// App.jsx
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={handleReset}
  onError={(error) => {
    console.error('Error caught by boundary:', error);
  }}
>
  {/* App content */}
</ErrorBoundary>
```

### Toast Notifications
```javascript
// App.jsx
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
```

## Feature Documentation

### Game Selection Feature
The game selection feature allows users to:
- View a list of available fighting games
- Select a game to view its character roster
- Select a character to begin combo building

#### Component Implementation
```javascript
// features/game-selection/components/GameSelection/GameSelection.jsx
const GameSelection = () => {
  const dispatch = useDispatch();
  const games = useSelector(selectGames);
  const selectedGame = useSelector(selectSelectedGame);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const isLoading = useSelector(state => state.app.isLoading);

  // Component implementation
};
```

## Development Guidelines

### Component Structure
```
/ComponentName/
  ├── ComponentName.jsx
  ├── ComponentName.scss
  └── index.js
```

### Code Style
- Use functional components with hooks
- Follow BEM naming in SCSS
- Implement proper error handling
- Use Redux for state management

### Best Practices
1. Keep components small and focused
2. Use feature-based architecture
3. Implement proper error boundaries
4. Follow BEM methodology for CSS
5. Use proper responsive design practices
6. Implement proper state management

### Adding New Features
1. Create feature directory in `src/features`
2. Add components, services, and store
3. Update root reducer if needed
4. Add styling following BEM

## Next Steps
Planned features and improvements:
1. Combo builder implementation with drag-and-drop interface
2. Game/character filtering and search functionality
3. Route configuration for different views
4. Backend integration for data persistence
5. User authentication and profiles
6. Combo sharing and rating system