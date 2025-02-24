# Feature Development Guide

## Overview
This guide outlines the process and best practices for developing new features in our React application.

## Feature Structure

### Directory Structure
```
features/
└── [feature-name]/
    ├── components/
    │   └── [Component]/
    │       ├── Component.jsx
    │       ├── Component.scss
    │       └── index.js
    ├── store/
    │   └── featureSlice.js
    ├── hooks/
    │   └── useFeature.js
    └── utils/
        └── featureUtils.js
```

## Adding a New Feature

### 1. Create Feature Directory
Create a new directory under `src/features` with the following structure:

```bash
mkdir -p src/features/new-feature/{components,store,hooks,utils}
```

### 2. Create Feature Components

```javascript
// features/new-feature/components/NewFeature/NewFeature.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './NewFeature.scss';

const NewFeature = () => {
  const dispatch = useDispatch();
  const featureData = useSelector(state => state.newFeature.data);

  return (
    <div className="new-feature">
      {/* Component content */}
    </div>
  );
};

export default NewFeature;
```

```scss
// features/new-feature/components/NewFeature/NewFeature.scss
.new-feature {
  &__container {
    // Styles following BEM methodology
  }

  &__element {
    // Element styles
  }
}
```

### 3. Create Feature Store

```javascript
// features/new-feature/store/newFeatureSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  isLoading: false,
  error: null
};

const newFeatureSlice = createSlice({
  name: 'newFeature',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setData, setLoading, setError } = newFeatureSlice.actions;
export default newFeatureSlice.reducer;

// Selectors
export const selectFeatureData = state => state.newFeature.data;
export const selectFeatureLoading = state => state.newFeature.isLoading;
export const selectFeatureError = state => state.newFeature.error;
```

### 4. Create Custom Hooks

```javascript
// features/new-feature/hooks/useFeature.js
import { useSelector, useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '../store/newFeatureSlice';
import { selectFeatureData, selectFeatureLoading, selectFeatureError } from '../store/newFeatureSlice';

export const useFeature = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectFeatureData);
  const isLoading = useSelector(selectFeatureLoading);
  const error = useSelector(selectFeatureError);

  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      // Fetch data
      dispatch(setData(data));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    data,
    isLoading,
    error,
    loadData
  };
};
```

## Integration Steps

### 1. Add to Root Reducer
```javascript
// store/rootReducer.js
import newFeatureReducer from '../features/new-feature/store/newFeatureSlice';

const rootReducer = combineReducers({
  // ... other reducers
  newFeature: newFeatureReducer
});
```

### 2. Add Routes (if needed)
```javascript
// App.jsx or routing configuration
import NewFeature from './features/new-feature/components/NewFeature';

<Route path="/new-feature" element={<NewFeature />} />
```

### 3. Add to Navigation
```javascript
// components/Navigation/Navigation.jsx
<Link to="/new-feature" className="nav__link">
  New Feature
</Link>
```

## Best Practices

### Component Development
1. Keep components focused and single-responsibility
2. Use custom hooks for complex logic
3. Implement proper error handling
4. Follow BEM methodology for styling
5. Add proper TypeScript types (if using TypeScript)

### State Management
1. Keep state normalized
2. Use selectors for accessing state
3. Handle loading and error states
4. Use proper action naming conventions

### Testing
1. Write unit tests for reducers
2. Write integration tests for complex features
3. Test error scenarios
4. Mock external dependencies

## Example: Adding a Combo Builder Feature

```javascript
// features/combo-builder/components/ComboBuilder/ComboBuilder.jsx
const ComboBuilder = () => {
  const { moves, selectedMove, addMove, removeMove } = useComboBuilder();
  
  return (
    <div className="combo-builder">
      <div className="combo-builder__moves">
        {moves.map(move => (
          <MoveCard 
            key={move.id}
            move={move}
            onSelect={() => addMove(move)}
          />
        ))}
      </div>
      <div className="combo-builder__sequence">
        {/* Combo sequence display */}
      </div>
    </div>
  );
};
```

## Feature Checklist

Before deploying a new feature, ensure:

1. Components
   - [ ] Proper component structure
   - [ ] Error handling implemented
   - [ ] Loading states handled
   - [ ] Responsive design
   - [ ] Accessibility features

2. State Management
   - [ ] Redux slice created
   - [ ] Actions and reducers tested
   - [ ] Selectors implemented
   - [ ] State normalized

3. Styling
   - [ ] BEM methodology followed
   - [ ] Responsive design
   - [ ] Theme support
   - [ ] Animations (if needed)

4. Testing
   - [ ] Unit tests written
   - [ ] Integration tests
   - [ ] Error scenarios tested
   - [ ] Performance tested

5. Documentation
   - [ ] Component documentation
   - [ ] API documentation
   - [ ] Usage examples
   - [ ] Deployment notes