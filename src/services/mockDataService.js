// src/services/mockDataService.js

import games from '../mock-data/games.json';
import characters from '../mock-data/characters.json';
import combos from '../mock-data/combos.json';
import users from '../mock-data/users.json';

// Simulate API delay for more realistic development experience
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Game-related methods
export const getGames = async () => {
  await delay();
  // Extract the games array from the JSON structure
  return games.games || [];
};

export const getGameById = async (gameId) => {
  await delay();
  // Extract the games array and find the specific game
  const gamesArray = games.games || [];
  return gamesArray.find(game => game.id === gameId) || null;
};

// Get just the notation data for a specific game
export const getGameNotation = async (gameId) => {
  const game = await getGameById(gameId);
  return game ? game.notation : null;
};

// Character-related methods
export const getCharacters = async () => {
  await delay();
  // Extract the characters array from the JSON structure
  return characters.characters || [];
};

export const getCharactersByGameId = async (gameId) => {
  await delay();
  // Extract the characters array and filter by game ID
  const charactersArray = characters.characters || [];
  return charactersArray.filter(character => character.gameId === gameId);
};

export const getCharacterById = async (characterId) => {
  await delay();
  // Extract the characters array and find the specific character
  const charactersArray = characters.characters || [];
  return charactersArray.find(character => character.id === characterId) || null;
};

// Get a specific notation element from a game
export const getNotationElement = async (gameId, categoryId, elementId) => {
  const game = await getGameById(gameId);
  if (!game || !game.notation || !game.notation.categories[categoryId]) return null;
  
  return game.notation.categories[categoryId].find(element => element.id === elementId) || null;
};

// Combo-related methods
export const getCombosByCharacterId = async (characterId) => {
  await delay();
  // Extract the combos array and filter by character ID
  const combosArray = combos.combos || [];
  return combosArray.filter(combo => combo.characterId === characterId);
};

export const getCombosByGameId = async (gameId) => {
  await delay();
  // Extract the combos array and filter by game ID
  const combosArray = combos.combos || [];
  return combosArray.filter(combo => combo.gameId === gameId);
};

export const getComboById = async (comboId) => {
  await delay();
  // Extract the combos array and find the specific combo
  const combosArray = combos.combos || [];
  const combo = combosArray.find(combo => combo.id === comboId);
  if (!combo) return null;
  
  // Get related character and game info
  const character = await getCharacterById(combo.characterId);
  const game = await getGameById(combo.gameId);
  
  return {
    ...combo,
    character: character ? { id: character.id, name: character.name } : null,
    game: game ? { id: game.id, name: game.name } : null
  };
};

// The rest of the code remains unchanged...

// Expand a combo with full notation element details
export const getExpandedCombo = async (comboId) => {
  const combo = await getComboById(comboId);
  if (!combo) return null;
  
  // Get game for this combo
  const game = await getGameById(combo.gameId);
  if (!game || !game.notation) return combo;
  
  // Expand each notation item with its full details
  const expandedNotation = await Promise.all(
    combo.notation.map(async (item) => {
      const { categoryId, elementId } = item;
      
      // Get the element from the appropriate category
      const element = game.notation.categories[categoryId]?.find(el => el.id === elementId);
      
      return {
        ...item,
        element: element || null
      };
    })
  );
  
  return {
    ...combo,
    expandedNotation
  };
};

// Create a new combo
export const createCombo = async (comboData) => {
  await delay();
  // In a real API, this would add the combo to the database
  // For mock data, we just return the combo with an ID
  const newCombo = {
    id: `combo_${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    ...comboData
  };
  return newCombo;
};

// Like/dislike a combo
export const likeCombo = async (comboId, userId) => {
  await delay();
  const combosArray = combos.combos || [];
  const combo = combosArray.find(combo => combo.id === comboId);
  if (!combo) throw new Error('Combo not found');
  
  // In a real API, this would update the database
  return {
    ...combo,
    likes: combo.likes + 1
  };
};

export const dislikeCombo = async (comboId, userId) => {
  await delay();
  const combosArray = combos.combos || [];
  const combo = combosArray.find(combo => combo.id === comboId);
  if (!combo) throw new Error('Combo not found');
  
  // In a real API, this would update the database
  return {
    ...combo,
    dislikes: combo.dislikes + 1
  };
};

// User-related methods (for future use)
export const getUserById = async (userId) => {
  await delay();
  const usersArray = users.users || [];
  return usersArray.find(user => user.id === userId) || null;
};

// Convert a combo to a display string
export const renderComboNotationAsString = async (combo) => {
  if (!combo || !combo.notation) return '';
  
  // If we have the expanded notation with elements already
  if (combo.expandedNotation) {
    return combo.expandedNotation.map(item => {
      return item.element ? item.element.symbol : '';
    }).join('');
  }
  
  // Otherwise we need to load each element
  const game = await getGameById(combo.gameId);
  if (!game || !game.notation) return '';
  
  return combo.notation.map(item => {
    const element = game.notation.categories[item.categoryId]?.find(el => el.id === item.elementId);
    return element ? element.symbol : '';
  }).join('');
};

// For the combo builder - get all notation data organized by category
export const getNotationDataForComboBuilder = async (gameId, characterId) => {
  await delay();
  
  const game = await getGameById(gameId);
  const character = await getCharacterById(characterId);
  
  if (!game || !character || !game.notation) return null;
  
  return {
    game: {
      id: game.id,
      name: game.name
    },
    character: {
      id: character.id,
      name: character.name
    },
    notationElements: game.notation.categories
  };
};

// Combined data methods (for efficiency)
export const getGameWithCharacters = async (gameId) => {
  await delay();
  const game = await getGameById(gameId);
  if (!game) return null;
  
  const gameCharacters = await getCharactersByGameId(gameId);
  
  return {
    ...game,
    characters: gameCharacters
  };
};

export const getCharacterWithCombos = async (characterId) => {
  await delay();
  const character = await getCharacterById(characterId);
  if (!character) return null;
  
  const characterCombos = await getCombosByCharacterId(characterId);
  const game = await getGameById(character.gameId);
  
  return {
    ...character,
    combos: characterCombos,
    game: game ? { id: game.id, name: game.name } : null
  };
};