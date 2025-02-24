// store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "../features/app/store/appSlice";
import gameSelectionReducer from "../features/game-selection/store/gameSelectionSlice";
import characterSelectionReducer from "../features/character-selection/store/characterSelectionSlice";
import comboBuilderReducer from "../features/combo-builder/store/comboBuilderSlice";
import themeReducer from "../features/app/store/themeSlice";

const rootReducer = combineReducers({
  app: appReducer,
  gameSelection: gameSelectionReducer,
  characterSelection: characterSelectionReducer,
  comboBuilder: comboBuilderReducer,
  theme: themeReducer,
});

export default rootReducer;
