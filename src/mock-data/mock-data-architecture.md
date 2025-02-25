# Mock Data Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Data Structure](#data-structure)
  - [Games](#games)
  - [Characters](#characters)
  - [Combos](#combos)
  - [Users](#users)
- [Mock Data Service](#mock-data-service)
  - [Basic Methods](#basic-methods)
  - [Advanced Methods](#advanced-methods)
  - [Combo-Specific Methods](#combo-specific-methods)
  - [Helper Methods](#helper-methods)
- [Usage Examples](#usage-examples)
- [Integration with Redux](#integration-with-redux)
- [Best Practices](#best-practices)

## Overview

The mock data architecture for the Combo Compendium application is designed to simulate a backend API during development. It features a hierarchical data structure where notation elements are nested within their respective games, and a comprehensive service layer that provides controlled access to this data.

## Data Structure

The mock data is organized into four primary JSON files:

### Games

**File Path**: `src/mock-data/games.json`

Games are the top-level entities that contain all game-specific information, including their notation systems. Each game contains:

- Basic information (id, name, developer, etc.)
- Complete notation system organized by categories
- Each notation element includes display information (symbol, image URL)

```json
{
  "games": [
    {
      "id": "sf6",
      "name": "Street Fighter 6",
      "imageUrl": "/images/games/sf6.jpg",
      "developer": "Capcom",
      "releaseYear": 2023,
      "platform": ["PS5", "Xbox Series X", "PC"],
      "description": "The newest installment in the Street Fighter series...",
      "notation": {
        "categories": {
          "buttons": [
            { "id": "LP", "name": "Light Punch", "symbol": "LP", "imageUrl": "/images/notation/sf6/LP.png" },
            // More buttons...
          ],
          "directions": [
            // Direction elements...
          ],
          // More categories...
        }
      }
    },
    // More games...
  ]
}
```

### Characters

**File Path**: `src/mock-data/characters.json`

Characters reference their parent game through `gameId` and contain character-specific information:

```json
{
  "characters": [
    {
      "id": "ryu",
      "gameId": "sf6",
      "name": "Ryu",
      "imageUrl": "/images/characters/sf6/ryu.jpg",
      "difficulty": "medium",
      "archetype": "Shoto",
      "description": "The wandering warrior seeking mastery of his craft."
    },
    // More characters...
  ]
}
```

### Combos

**File Path**: `src/mock-data/combos.json`

Combos reference both their game and character, and contain a sequence of notation elements:

```json
{
  "combos": [
    {
      "id": "combo1",
      "characterId": "ryu",
      "gameId": "sf6",
      "name": "Basic BnB",
      "description": "A basic bread and butter combo that works midscreen",
      "notation": [
        {"categoryId": "text", "elementId": "cr"},
        {"categoryId": "buttons", "elementId": "MP"},
        // More notation elements...
      ],
      "damage": 120,
      "difficulty": "easy",
      "video": "https://youtu.be/example1",
      "createdBy": "user123",
      "createdAt": "2023-05-15T14:30:00Z",
      "likes": 42,
      "dislikes": 3
    },
    // More combos...
  ]
}
```

### Users

**File Path**: `src/mock-data/users.json`

Users contain authentication and preference data:

```json
{
  "users": [
    {
      "id": "user123",
      "username": "ComboKing",
      "email": "combo.king@example.com",
      "avatarUrl": "/images/avatars/user123.jpg",
      "createdAt": "2023-01-10T12:00:00Z",
      "favorites": {
        "characters": ["ryu", "kazuya"],
        "combos": ["combo2"]
      }
    },
    // More users...
  ]
}
```

## Mock Data Service

**File Path**: `src/services/mockDataService.js`

The mock data service provides a comprehensive API for accessing and manipulating mock data. All methods are asynchronous with simulated network delays to better mimic real API behavior.

### Basic Methods

#### Game Methods

```javascript
// Get all games
export const getGames = async () => { /* ... */ }

// Get a specific game by ID
export const getGameById = async (gameId) => { /* ... */ }

// Get just the notation data for a specific game
export const getGameNotation = async (gameId) => { /* ... */ }
```

#### Character Methods

```javascript
// Get all characters
export const getCharacters = async () => { /* ... */ }

// Get characters for a specific game
export const getCharactersByGameId = async (gameId) => { /* ... */ }

// Get a specific character by ID
export const getCharacterById = async (characterId) => { /* ... */ }
```

#### Notation Element Methods

```javascript
// Get a specific notation element
export const getNotationElement = async (gameId, categoryId, elementId) => { /* ... */ }
```

### Advanced Methods

#### Combined Data Methods

These methods retrieve related entities together for efficiency:

```javascript
// Get a game with all its characters
export const getGameWithCharacters = async (gameId) => { /* ... */ }

// Get a character with all its combos
export const getCharacterWithCombos = async (characterId) => { /* ... */ }

// Get notation data organized for the combo builder
export const getNotationDataForComboBuilder = async (gameId, characterId) => { /* ... */ }
```

### Combo-Specific Methods

```javascript
// Get combos for a specific character
export const getCombosByCharacterId = async (characterId) => { /* ... */ }

// Get combos for a specific game
export const getCombosByGameId = async (gameId) => { /* ... */ }

// Get a specific combo by ID
export const getComboById = async (comboId) => { /* ... */ }

// Get a combo with expanded notation elements
export const getExpandedCombo = async (comboId) => { /* ... */ }

// Create a new combo
export const createCombo = async (comboData) => { /* ... */ }

// Like a combo
export const likeCombo = async (comboId, userId) => { /* ... */ }

// Dislike a combo
export const dislikeCombo = async (comboId, userId) => { /* ... */ }
```

### Helper Methods

```javascript
// Render a combo's notation as a readable string
export const renderComboNotationAsString = async (combo) => { /* ... */ }
```

## Usage Examples

### Basic Data Retrieval

```javascript
import { getGames, getCharactersByGameId } from '../services/mockDataService';

// Using the service in a component
useEffect(() => {
  const loadData = async () => {
    // Get all games
    const games = await getGames();
    setGames(games);
    
    if (selectedGameId) {
      // Get characters for selected game
      const characters = await getCharactersByGameId(selectedGameId);
      setCharacters(characters);
    }
  };
  
  loadData();
}, [selectedGameId]);
```

### Combo Builder Data

```javascript
import { getNotationDataForComboBuilder } from '../services/mockDataService';

// Load data for combo builder
useEffect(() => {
  const loadNotationData = async () => {
    try {
      setIsLoading(true);
      
      const data = await getNotationDataForComboBuilder(gameId, characterId);
      if (!data) {
        throw new Error('Failed to load notation data');
      }
      
      setNotationData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  loadNotationData();
}, [gameId, characterId]);
```

### Creating a Combo

```javascript
import { createCombo } from '../services/mockDataService';

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const newComboData = {
      gameId,
      characterId,
      name: comboName,
      description: comboDescription,
      notation: comboSequence,
      damage: parseInt(comboDamage) || 0,
      difficulty: comboDifficulty,
      video: comboVideo,
      createdBy: currentUser?.id || 'anonymous'
    };
    
    const result = await createCombo(newComboData);
    toast.success('Combo created successfully!');
    navigate(`/combos/${result.id}`);
  } catch (error) {
    toast.error(error.message || 'Error creating combo');
  }
};
```

## Integration with Redux

The mock data service integrates seamlessly with Redux using createAsyncThunk:

```javascript
// In a Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGames, getGameById } from '../services/mockDataService';

export const fetchGames = createAsyncThunk(
  'gameSelection/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const games = await getGames();
      return games;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch games');
    }
  }
);

// In the slice's extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchGames.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchGames.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.games = action.payload;
    })
    .addCase(fetchGames.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
}
```

## Best Practices

1. **Always use async/await**: All service methods return promises and should be used with async/await.

2. **Handle loading states**: When calling service methods, maintain loading states in your UI.

3. **Error handling**: Wrap service calls in try/catch blocks and display user-friendly error messages.

4. **Minimizing data access**: Use the specialized combined methods when you need related entities together.

5. **Transitioning to real API**: When moving to a real backend, maintain the same method signatures to minimize changes to your components.

6. **Performance considerations**: For larger mock datasets, consider implementing pagination or infinite scrolling patterns.

7. **Consistency in ID usage**: Always use the consistent ID references when relating entities (gameId, characterId, etc.).

This mock data architecture provides a solid foundation for development and can be easily replaced with real API calls when you're ready to connect to a backend server.
