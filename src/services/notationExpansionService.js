import gamesData from '../mock-data/games.json';

/**
 * Expands notation elements with full details from game notation reference
 * @param {Object} combo - Combo object containing notation
 * @returns {Array} Expanded notation with full details
 */
export const expandComboNotation = (combo) => {
  // Find the game's notation reference
  const game = gamesData.games.find(g => g.id === combo.gameId);
  
  if (!game || !game.notation || !game.notation.categories) {
    console.warn(`No notation reference found for game: ${combo.gameId}`);
    return combo.notation;
  }
  
  // Expand each notation element
  return combo.notation.map(notationItem => {
    const category = game.notation.categories[notationItem.categoryId];
    
    if (!category) {
      console.warn(`Category not found: ${notationItem.categoryId}`);
      return notationItem;
    }
    
    // Find the specific element in the category
    const element = category.find(el => el.id === notationItem.elementId);
    
    if (!element) {
      console.warn(`Element not found: ${notationItem.categoryId}.${notationItem.elementId}`);
      return notationItem;
    }
    
    // Return expanded notation element
    return {
      ...notationItem,
      ...element,
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
    'text': 'Text'
  };
  
  return categoryMap[categoryId] || categoryId;
};

/**
 * Get notation element details for a specific game
 * @param {string} gameId - Game ID
 * @param {string} categoryId - Category ID
 * @param {string} elementId - Element ID
 * @returns {Object|null} Notation element details
 */
export const getNotationElement = (gameId, categoryId, elementId) => {
  const game = gamesData.games.find(g => g.id === gameId);
  
  if (!game || !game.notation || !game.notation.categories) {
    return null;
  }
  
  const category = game.notation.categories[categoryId];
  
  if (!category) {
    return null;
  }
  
  return category.find(el => el.id === elementId) || null;
};

/**
 * Get all notation for a specific game
 * @param {string} gameId - Game ID
 * @returns {Object} Game's notation categories
 */
export const getGameNotation = (gameId) => {
  const game = gamesData.games.find(g => g.id === gameId);
  
  if (!game || !game.notation) {
    return {};
  }
  
  return game.notation.categories;
};