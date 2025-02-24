# Character Selection Feature - Documentation

## Table of Contents
1. [Overview](#overview)
2. [Feature Structure](#feature-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [State Management](#state-management)
5. [Styling Implementation](#styling-implementation)
6. [User Flow](#user-flow)
7. [Technical Decisions](#technical-decisions)
8. [Common Issues and Solutions](#common-issues-and-solutions)

## Overview

The Character Selection feature allows users to browse and select characters from their chosen game. It displays characters in a responsive grid with visual indicators for difficulty level and character archetype. After selecting a character, users are redirected to the combo list page for that specific character.

This feature adheres to the application's feature-based architecture pattern, using Redux for state management and SCSS with BEM methodology for styling.

## Feature Structure

```
src/features/characterSelection/
├── components/                   # UI components
│   ├── CharacterCard/            # Individual character card component
│   │   ├── CharacterCard.jsx
│   │   ├── CharacterCard.scss
│   │   └── index.js
│   └── CharacterSelection/       # Character grid container component
│       ├── CharacterSelection.jsx
│       ├── CharacterSelection.scss
│       └── index.js
├── hooks/                        # Custom hooks
│   └── useCharacterSelection.js  # Hook for character selection logic
├── pages/                        # Page components
│   └── CharacterSelectionPage/   # Main page component
│       ├── CharacterSelectionPage.jsx
│       ├── CharacterSelectionPage.scss
│       └── index.js
├── store/                        # Redux state management
│   └── characterSelectionSlice.js # Redux slice for this feature
└── index.js                      # Public exports
```

## Component Hierarchy

```
CharacterSelectionPage
└── CharacterSelection
    └── CharacterCard (multiple)
```

### CharacterSelectionPage
The top-level container that:
- Displays the header with the selected game name
- Provides a back button to return to game selection
- Contains the CharacterSelection component
- Handles redirects when no game is selected

### CharacterSelection
A container component that:
- Manages the grid display of character cards
- Handles loading, error, and empty states
- Uses the useCharacterSelection hook for data and actions

### CharacterCard
A presentational component that displays:
- Character image with fallback for missing images
- Character name and archetype
- Difficulty level with color coding
- Visual indicators for selected state

## State Management

### Redux Slice: characterSelectionSlice.js

The character selection feature uses Redux for state management with the following structure:

```javascript
{
  characterSelection: {
    characters: [],              // Array of character objects
    selectedCharacter: null,     // Currently selected character or null
    status: 'idle',              // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null                  // Error message or null
  }
}
```

#### Actions
- `selectCharacter`: Sets the selectedCharacter state
- `clearSelectedCharacter`: Resets the selectedCharacter to null
- `clearCharacters`: Resets the entire character selection state
- `setError`: Updates the error state

#### Async Thunk
- `fetchCharacters`: Fetches characters based on the selected game ID
  - Currently uses mock data with simulated API delay
  - Will connect to a real API in the future

#### Selectors
- `selectCharacters`: Returns the array of characters
- `selectSelectedCharacter`: Returns the currently selected character
- `selectCharactersStatus`: Returns the loading status
- `selectCharactersError`: Returns any error message

### Integration with Game Selection

The character selection feature integrates with the game selection feature:
- When a game is selected, the character list is cleared first
- Character data is loaded based on the selected game's ID
- The URL includes the game ID for direct navigation

## Styling Implementation

### CharacterCard Styling

The CharacterCard component uses SCSS with BEM methodology:

- **Space-Efficient Design**:
  - Fixed width and height (160px x 180px) for consistent layout
  - Can be adjusted for different screen sizes
  - Compact display of essential information

- **Visual Indicators**:
  - Color-coded difficulty badges:
    - Easy: Green
    - Medium: Amber
    - Hard: Red
  - Character archetype displayed below the name
  - Selected state with primary color border and elevation

- **Glassmorphism Effect**:
  - Semi-transparent background
  - Backdrop filter blur
  - Subtle border and shadow
  - Hover effects for better user feedback

### CharacterSelection Grid

- Responsive flex layout that adjusts based on screen size
- Centered alignment with consistent spacing
- Smooth wrapping for various character counts
- Styled loading, error, and empty states

## User Flow

1. **Game Selection**:
   - User selects a game from the game selection page
   - Selection dispatches actions to clear previous character state
   - User is navigated to `/games/:gameId/characters`

2. **Character Browsing**:
   - Characters are loaded and displayed in a grid
   - User can see character names, images, difficulty levels, and archetypes
   - Loading states are shown while data is being fetched

3. **Character Selection**:
   - User clicks on a character card
   - Selected character is stored in Redux state
   - User is navigated to `/games/:gameId/characters/:characterId/combos`

4. **Navigation**:
   - Back button allows return to game selection
   - URL parameters enable direct navigation to specific games/characters
   - Missing game selection redirects to game selection page

## Technical Decisions

### Error Handling

The character selection feature implements robust error handling:

1. **Loading States**:
   - Displays a loading spinner during data fetching
   - Prevents premature rendering of incomplete data

2. **Error States**:
   - Catches and displays user-friendly error messages
   - Provides retry functionality for failed data loading

3. **Empty States**:
   - Handles cases where no characters are available
   - Provides appropriate messaging and actions

4. **Missing Data Handling**:
   - Handles cases where images fail to load
   - Provides fallback image with state tracking to prevent flickering

### URL Parameter Handling

The feature supports URL-based navigation in addition to Redux state:

- Can load character data directly from URL game ID parameter
- Allows bookmarking and sharing specific character selection pages
- Falls back to Redux state when URL parameters are missing

## Common Issues and Solutions

### Issue: Character list not refreshing when selecting a different game

**Solution**: The game selection hook now dispatches the `clearCharacters` action before selecting a new game, ensuring that:
- Previous character data is cleared
- Loading state is reset
- A fresh fetch is triggered for the new game's characters

```javascript
const handleSelectGame = useCallback((game) => {
  // Clear character state first
  dispatch(clearCharacters());
  
  // Then set selected game and navigate
  dispatch(selectGame(game));
  navigate(`/games/${game.id}/characters`);
}, [dispatch, navigate]);
```

### Issue: Missing images causing flickering in character cards

**Solution**: The CharacterCard component now uses state tracking to handle image loading errors properly:

```javascript
const [usePlaceholder, setUsePlaceholder] = useState(false);

const handleImageError = (e) => {
  if (!usePlaceholder) {
    setUsePlaceholder(true);
    e.target.src = '/placeholder-character.jpg';
  }
};

// In render:
<img 
  src={usePlaceholder ? '/placeholder-character.jpg' : character.imageUrl} 
  alt={character.name} 
  onError={handleImageError}
/>
```

This ensures the error handler only triggers once, preventing the flickering effect.

### Issue: Redux integration with root reducer

**Solution**: The character selection slice must be properly included in the root reducer:

```javascript
// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import gameSelectionReducer from '../features/gameSelection/store/gameSelectionSlice';
import characterSelectionReducer from '../features/characterSelection/store/characterSelectionSlice';

const rootReducer = combineReducers({
  gameSelection: gameSelectionReducer,
  characterSelection: characterSelectionReducer,
});

export default rootReducer;
```

Failure to include the reducer results in the "state.characterSelection is undefined" error.