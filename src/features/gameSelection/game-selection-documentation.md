# Game Selection Feature - Documentation

## Table of Contents
1. [Overview](#overview)
2. [Feature Structure](#feature-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [State Management](#state-management)
5. [Styling Implementation](#styling-implementation)
6. [User Flow](#user-flow)
7. [Future Enhancements](#future-enhancements)
8. [Technical Decisions](#technical-decisions)

## Overview

The Game Selection feature serves as the landing page for authenticated users in the Combo Compendium application. It displays available fighting games in a responsive grid of cards, allowing users to browse and select a game to view its characters and combos.

This feature is implemented following a feature-based architecture pattern, using Redux for state management and SCSS with BEM methodology for styling.

## Feature Structure

```
src_new/features/gameSelection/
├── components/                 # UI components
│   ├── GameCard/               # Individual game card component
│   │   ├── GameCard.jsx
│   │   ├── GameCard.scss
│   │   └── index.js
│   └── GameSelection/          # Game grid container component
│       ├── GameSelection.jsx
│       ├── GameSelection.scss
│       └── index.js
├── hooks/                      # Custom hooks
│   └── useGameSelection.js     # Hook for game selection logic
├── pages/                      # Page components
│   └── GameSelectionPage/      # Main page component
│       ├── GameSelectionPage.jsx
│       ├── GameSelectionPage.scss
│       └── index.js
├── store/                      # Redux state management
│   └── gameSelectionSlice.js   # Redux slice for this feature
└── index.js                    # Public exports
```

## Component Hierarchy

```
GameSelectionPage
└── GameSelection
    └── GameCard (multiple)
```

### GameSelectionPage
The top-level component that serves as the page container. It includes:
- A header with a title and subtitle
- The GameSelection component

### GameSelection
A container component that:
- Manages the display of game cards in a responsive grid
- Handles loading, error, and empty states
- Uses the useGameSelection hook for game data and actions

### GameCard
A presentational component that displays:
- Game image with overlay and badge
- Game title and developer
- Platform information
- A select button
- Visual indication when selected

## State Management

State for this feature is managed using Redux Toolkit with the following structure:

```javascript
{
  gameSelection: {
    games: [],              // Array of game objects
    selectedGame: null,     // Currently selected game or null
    status: 'idle',         // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null             // Error message or null
  }
}
```

### Redux Slice

The gameSelectionSlice implements:

1. **Actions**:
   - `selectGame`: Sets the selectedGame state
   - `clearSelectedGame`: Resets the selectedGame to null
   - `setError`: Updates the error state

2. **Async Thunk**:
   - `fetchGames`: Simulates API call to load games (currently uses mock data)

3. **Selectors**:
   - `selectGames`: Returns the games array
   - `selectSelectedGame`: Returns the currently selected game
   - `selectGamesStatus`: Returns the loading status
   - `selectGamesError`: Returns any error message

### useGameSelection Hook

This custom hook encapsulates the Redux state and dispatching logic:
- Loads games on component mount if they're not already loaded
- Provides access to game data, loading status, and errors
- Handles game selection and navigation
- Provides a refresh function to reload games

## Styling Implementation

### BEM Methodology

The feature follows the Block Element Modifier (BEM) methodology for CSS class naming:

```scss
.game-card {               // Block
  &__image-container {     // Element
    // ...
  }
  
  &--selected {            // Modifier
    // ...
  }
}
```

### Modern Sass Modules

The SCSS files use the modern `@use` syntax with proper namespacing:

```scss
@use '../../../../styles/abstracts/mixins' as mixins;

.game-card {
  @include mixins.glass-effect;
  // ...
}
```

### Responsive Design

The game grid is responsive, with different column counts based on screen width:
- 1 column on mobile
- 2 columns on small screens
- 3 columns on medium screens
- 4 columns on large screens

### Glassmorphism Effects

Game cards implement a glassmorphism effect with:
- Semi-transparent background
- Backdrop filter blur
- Subtle border
- Card shadow
- Hover effects for better user feedback

## User Flow

1. **Initial Load**:
   - User lands on the application (or navigates to `/games`)
   - While games are loading, a spinner is displayed
   - If an error occurs, an error message with a retry button is shown

2. **Browsing Games**:
   - Once loaded, games appear in a responsive grid
   - Each game displays its image, title, developer, and platform
   - Cards have hover effects for better interaction feedback

3. **Selecting a Game**:
   - User clicks a game card or its "Select" button
   - The selected game is stored in Redux state
   - User is navigated to `/games/:gameId/characters` route

4. **Error Handling**:
   - Network/loading errors show a user-friendly message
   - Empty state is handled gracefully
   - Retry functionality is provided

## Future Enhancements

1. **API Integration**:
   - Replace mock data with actual API calls
   - Implement proper error handling and retry logic

2. **Search & Filter**:
   - Add ability to search games by name
   - Filter games by platform, genre, or release year

3. **Favorites**:
   - Allow users to mark games as favorites
   - Add sorting/filtering by favorite status

4. **Pagination/Infinite Scroll**:
   - For larger game libraries, implement pagination or infinite scroll

5. **Animations**:
   - Add entrance animations for game cards
   - Improve transitions between states

## Technical Decisions

### Why Redux over Context API

Redux was chosen for state management because:
- It provides a predictable state container
- DevTools offer better debugging capabilities
- Middleware support for async operations
- Better performance for frequently updated state
- Clear separation of concerns with actions and reducers

### Why Feature-Based Architecture

This pattern was chosen for:
- Strong isolation between features
- Clear boundaries for responsibilities
- Better code organization for larger applications
- Easier onboarding for new developers
- Simplified maintenance and testing

### CSS Architecture Decisions

The styling system uses:
- SCSS for better organization and reuse
- BEM methodology for clear, maintainable class naming
- Modern `@use` syntax for better module management
- CSS variables for theming and consistency
- Responsive design with mobile-first approach
- Glassmorphism for a modern UI appearance