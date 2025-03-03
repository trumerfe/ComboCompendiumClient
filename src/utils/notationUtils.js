// src/utils/notationUtils.js
import { getGameById } from '../services/apiService';

// Cache for game data to avoid repeated API calls
const gameCache = new Map();

/**
 * Retrieves game data either from cache or API
 * @param {string} gameId - Game ID to retrieve
 * @returns {Promise<Object>} - Game data
 */
const getGameData = async (gameId) => {
  if (gameCache.has(gameId)) {
    return gameCache.get(gameId);
  }

  try {
    const gameData = await getGameById(gameId);
    gameCache.set(gameId, gameData);
    return gameData;
  } catch (error) {
    console.error(`Error fetching game data for ${gameId}:`, error);
    return null;
  }
};

/**
 * Expands notation elements with full details from game notation reference
 * @param {Object} combo - Combo object containing notation
 * @returns {Promise<Array>} - Expanded notation with full details
 */
export const expandComboNotation = async (combo) => {
  if (!combo || !combo.gameId || !combo.notation || !Array.isArray(combo.notation)) {
    return [];
  }

  // Get the game data from API/cache
  const game = await getGameData(combo.gameId);
  
  if (!game || !game.notation || !game.notation.categories) {
    console.warn(`No notation reference found for game: ${combo.gameId}`);
    return combo.notation;
  }
  
  // Expand each notation element
  return combo.notation.map(notationItem => {
    if (!notationItem || !notationItem.categoryId || !notationItem.elementId) {
      return notationItem;
    }

    const category = game.notation.categories[notationItem.categoryId];
    
    if (!category) {
      console.warn(`Category not found: ${notationItem.categoryId}`);
      return {
        ...notationItem,
        name: notationItem.elementId,
        symbol: notationItem.elementId,
        numpad: '', // Ensure numpad property exists
        categoryName: getCategoryName(notationItem.categoryId)
      };
    }
    
    // Find the specific element in the category
    const element = Array.isArray(category) 
      ? category.find(el => el.id === notationItem.elementId)
      : null;
    
    if (!element) {
      console.warn(`Element not found: ${notationItem.categoryId}.${notationItem.elementId}`);
      return {
        ...notationItem,
        name: notationItem.elementId,
        symbol: notationItem.elementId,
        numpad: '', // Ensure numpad property exists
        categoryName: getCategoryName(notationItem.categoryId)
      };
    }
    
    // Return expanded notation element, ensuring numpad exists
    return {
      ...notationItem,
      ...element,
      numpad: element.numpad || '', // Ensure numpad property exists
      categoryName: getCategoryName(notationItem.categoryId)
    };
  });
};

/**
 * Get human-readable category name
 * @param {string} categoryId - Category ID
 * @returns {string} Formatted category name
 */
const getCategoryName = (categoryId) => {
  const categoryMap = {
    'buttons': 'Buttons',
    'directions': 'Directions',
    'modifiers': 'Modifiers',
    'motions': 'Motions',
    'text': 'Text',
    'connectors': 'Connectors',
    'other': 'Other'
  };
  
  return categoryMap[categoryId] || categoryId;
};

/**
 * Get notation element details for a specific game
 * @param {string} gameId - Game ID
 * @param {string} categoryId - Category ID
 * @param {string} elementId - Element ID
 * @returns {Promise<Object|null>} Notation element details
 */
export const getNotationElement = async (gameId, categoryId, elementId) => {
  // Get the game data from API/cache
  const game = await getGameData(gameId);
  
  if (!game || !game.notation || !game.notation.categories) {
    return null;
  }
  
  const category = game.notation.categories[categoryId];
  
  if (!category || !Array.isArray(category)) {
    return null;
  }
  
  const element = category.find(el => el.id === elementId);
  
  if (!element) {
    return null;
  }
  
  // Ensure numpad exists on the returned element
  return {
    ...element,
    numpad: element.numpad || '' // Ensure numpad property exists
  };
};

/**
 * Get all notation for a specific game
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Game's notation categories
 */
export const getGameNotation = async (gameId) => {
  // Get the game data from API/cache
  const game = await getGameData(gameId);
  
  if (!game || !game.notation || !game.notation.categories) {
    return {};
  }
  
  // Process all categories to ensure numpad exists on each element
  const processedCategories = {};
  
  Object.entries(game.notation.categories).forEach(([categoryKey, elements]) => {
    if (!Array.isArray(elements)) {
      processedCategories[categoryKey] = [];
      return;
    }
    
    processedCategories[categoryKey] = elements.map(element => ({
      ...element,
      numpad: element.numpad || '' // Ensure numpad property exists
    }));
  });
  
  return processedCategories;
};

/**
 * Synchronous version for use with locally available notation data
 * @param {Object} notationData - Already fetched notation data
 * @param {string} categoryId - Category ID
 * @param {string} elementId - Element ID
 * @returns {Object|null} - Notation element
 */
export const findNotationElement = (notationData, categoryId, elementId) => {
  if (!notationData || !categoryId || !elementId) {
    return null;
  }
  
  const category = notationData[categoryId];
  
  if (!category || !Array.isArray(category)) {
    return null;
  }
  
  const element = category.find(el => el.id === elementId);
  
  if (!element) {
    return null;
  }
  
  return {
    ...element,
    numpad: element.numpad || '' // Ensure numpad property exists
  };
};