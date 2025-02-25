# Combo List Feature Documentation

## Overview

The Combo List feature allows users to view, like, and dislike combos for selected characters in the Combo Compendium application. It displays combos in a responsive card layout, sorted by popularity (likes), with the ability to toggle sort direction.

## Table of Contents

1. [Feature Structure](#feature-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [User Interactions](#user-interactions)
5. [Mock Data Integration](#mock-data-integration)
6. [Error Handling](#error-handling)
7. [Future Enhancements](#future-enhancements)

## Feature Structure

```
src/features/comboList/
├── components/                 # UI components
│   ├── ComboCard/              # Individual combo card component
│   │   ├── ComboCard.jsx
│   │   ├── ComboCard.scss
│   │   └── index.js
│   └── ComboList/              # Combo list container component
│       ├── ComboList.jsx
│       ├── ComboList.scss
│       └── index.js
├── hooks/                      # Custom hooks
│   └── useComboList.js         # Hook for combo list logic
├── pages/                      # Page components
│   └── ComboListPage/          # Main page component
│       ├── ComboListPage.jsx
│       ├── ComboListPage.scss
│       └── index.js
├── store/                      # Redux state management
│   └── comboListSlice.js       # Redux slice for this feature
└── index.js                    # Public exports
```

## Component Hierarchy

```
ComboListPage
└── ComboList
    └── ComboCard (multiple)
```

### ComboListPage

The top-level container that:
- Displays header with character and game information
- Provides navigation back to character selection
- Includes a "Create Combo" button for future combo creation
- Contains sort direction toggle controls
- Renders the ComboList component

### ComboList

A container component that:
- Renders multiple ComboCard components
- Handles loading, error, and empty states
- Provides error recovery via retry functionality

### ComboCard

A presentation component that displays:
- Combo name and difficulty level (color-coded)
- Damage value
- Notation sequence with proper styling for different elements
- Tags associated with the combo
- Creation date
- Like/dislike counts with interactive buttons

## State Management

### Redux Slice: comboListSlice.js

The state structure:

```javascript
{
  combos: [],               // Array of combo objects with expanded notation
  sortBy: 'likes',          // Field to sort by (currently only 'likes')
  sortDirection: 'desc',    // 'asc' or 'desc'
  status: 'idle',           // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null               // Error message or null
}
```

#### Async Thunks

1. **fetchCombosByCharacterId**: Fetches combos for a specific character
   - Gets combos from mockDataService
   - Expands notation elements with their display text
   - Sorts by likes count according to current sort direction

2. **likeCombo**: Likes a specific combo
   - Calls likeComboService from mockDataService
   - Updates the combo in state with new like count
   - Re-sorts the combo list

3. **dislikeCombo**: Dislikes a specific combo
   - Calls dislikeComboService from mockDataService
   - Updates the combo in state with new dislike count

#### Actions

1. **clearCombos**: Resets the combo list state
2. **toggleSortDirection**: Toggles between ascending and descending sort order

#### Selectors

1. **selectCombos**: Returns the combos array
2. **selectComboListStatus**: Returns the loading status
3. **selectComboListError**: Returns any error message
4. **selectSortDirection**: Returns the current sort direction

### Custom Hook: useComboList.js

Encapsulates combo list functionality:
- Loads combos for a specific character
- Provides navigation functions
- Exposes Redux state and actions

## User Interactions

### Viewing Combos

1. User navigates to a character's combo list via the character selection page
2. Combos are loaded and displayed in order of most likes first (default)
3. Loading, error, and empty states are handled with appropriate UI

### Like/Dislike

1. User clicks the like or dislike button on a combo card
2. The Redux action is dispatched to update the backend (mock service)
3. The combo's like/dislike count is updated in the UI
4. Combos are re-sorted if sorted by likes

### Sort Direction Toggle

1. User clicks the sort direction toggle button
2. Sort direction changes between ascending and descending
3. Combo list is re-sorted according to the new direction

## Mock Data Integration

The feature integrates with the existing mock data service:

```javascript
// Services used from mockDataService.js
import { 
  getCombosByCharacterId, 
  getGameNotation, 
  getNotationElement,
  likeCombo as likeComboService,
  dislikeCombo as dislikeComboService
} from '../../../services/mockDataService';
```

This ensures consistent data handling across the application and simplifies future migration to a real API.

## Error Handling

The feature implements comprehensive error handling:

1. **Component-Level**:
   - ComboList handles loading, error, and empty states
   - ComboCard implements defensive programming with null/undefined checks
   - All components degrade gracefully when data is missing

2. **Redux-Level**:
   - All thunks have proper error handling
   - Error messages are captured and stored in state
   - Action handlers guard against undefined values

3. **Recovery Mechanisms**:
   - Retry button for failed data loads
   - Default fallback values for all properties
   - Array type checking before mapping operations

## Future Enhancements

1. **Filtering**:
   - Add filtering by difficulty, damage, and tags
   - Implement a search function for finding specific combos

2. **Pagination**:
   - Add pagination for large combo lists
   - Implement infinite scrolling for better user experience

3. **User Reaction Tracking**:
   - Track which combos a user has already liked/disliked
   - Prevent duplicate likes/dislikes

4. **Comment System**:
   - Allow users to comment on combos
   - Show a count of comments on each combo card

5. **Real-Time Updates**:
   - Implement WebSocket connection for real-time like/dislike updates
   - Show live popularity rankings

## Code References

### ComboCard Component Example

```jsx
const ComboCard = ({ combo, currentUserId }) => {
  const dispatch = useDispatch();
  
  // Destructure with default values to prevent undefined errors
  const { 
    id: comboId = '',
    name = 'Unnamed Combo', 
    expandedNotation = [], 
    damage = 0, 
    difficulty = 'medium', 
    tags = [], 
    createdAt = new Date().toISOString(), 
    likes = 0, 
    dislikes = 0 
  } = combo || {};

  const handleLike = () => {
    dispatch(likeCombo({ comboId, userId: currentUserId }));
  };
  
  const handleDislike = () => {
    dispatch(dislikeCombo({ comboId, userId: currentUserId }));
  };

  // Component JSX...
};
```

### Redux Thunk Example

```javascript
export const likeCombo = createAsyncThunk(
  'comboList/likeCombo',
  async ({ comboId, userId }, { rejectWithValue }) => {
    if (!comboId || !userId) {
      return rejectWithValue('Combo ID and User ID are required');
    }
    
    try {
      const updatedCombo = await likeComboService(comboId, userId);
      return { comboId, updatedCombo };
    } catch (error) {
      console.error('Error liking combo:', error);
      return rejectWithValue(error.message || 'Failed to like combo');
    }
  }
);
```

### Sort Function Example

```javascript
const sortCombosByLikes = (combos = [], direction = 'desc') => {
  if (!Array.isArray(combos)) return [];
  
  return [...combos].sort((a, b) => {
    const aLikes = a?.likes || 0;
    const bLikes = b?.likes || 0;
    const comparison = aLikes - bLikes;
    return direction === 'asc' ? comparison : -comparison;
  });
};
```

## Defensive Programming Patterns

Throughout the implementation, these defensive programming patterns are used:

1. **Default Parameter Values**:
   ```javascript
   const sortCombosByLikes = (combos = [], direction = 'desc') => { ... }
   ```

2. **Null Coalescing**:
   ```javascript
   selectCombos = state => state.comboList?.combos || []
   ```

3. **Type Checking**:
   ```javascript
   if (!Array.isArray(combos)) return [];
   ```

4. **Destructuring with Defaults**:
   ```javascript
   const { name = 'Unnamed', likes = 0 } = combo || {};
   ```

5. **Early Returns**:
   ```javascript
   if (!combo || typeof combo !== 'object') return null;
   ```

These patterns ensure robust operation even with incomplete or malformed data.
