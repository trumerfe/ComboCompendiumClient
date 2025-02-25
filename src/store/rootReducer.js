// src/store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import gameSelectionReducer from '../features/gameSelection/store/gameSelectionSlice'
import characterSelectionReducer from '../features/characterSelection/store/characterSelectionSlice'
import comboListReducer from '../features/comboList/store/comboListSlice';
import comboCreationReducer from '../features/comboCreation/store/comboCreationSlice';

// We'll start with an empty reducer and add feature reducers as we implement them
const rootReducer = combineReducers({
  // Example: gameSelection: gameSelectionReducer,
  gameSelection: gameSelectionReducer,
  characterSelection: characterSelectionReducer,
  comboList: comboListReducer,
  comboCreation: comboCreationReducer
  // Add more reducers as features are implemented
});

export default rootReducer;