// src/services/notationService.js
import { getGameNotation } from "./apiService";
import { normalizeNotationElement } from "../features/comboCreation/services/NotationElementService";

// Cache for game notation data
const notationCache = new Map();

/**
 * Get category name from category ID
 * @param {string} categoryId - Category ID
 * @returns {string} - Formatted category name
 */
export const getCategoryName = (categoryId) => {
  const categoryMap = {
    buttons: "Buttons",
    directions: "Directions",
    modifiers: "Modifiers",
    motions: "Motions",
    connectors: "Connectors",
    text: "Text",
    other: "Other",
  };

  return (
    categoryMap[categoryId] ||
    categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
  );
};

/**
 * Fetch notation data for a game
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} - Game notation data
 */
export const fetchGameNotationData = async (gameId) => {
  if (!gameId) {
    console.warn("No game ID provided to fetchGameNotationData");
    return null;
  }

  // Return cached data if available
  if (notationCache.has(gameId)) {
    return notationCache.get(gameId);
  }

  try {
    // Fetch from API
    const response = await getGameNotation(gameId);

    if (response && response.success && response.data) {
      // Cache and return the data
      notationCache.set(gameId, response.data);
      return response.data;
    } else {
      console.warn(
        `Failed to fetch notation data for game ${gameId}:`,
        response
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching notation data for game ${gameId}:`, error);
    return null;
  }
};

/**
 * Expand notation for a combo using game notation data
 * @param {Object} combo - Combo object with gameId and notation
 * @returns {Promise<Array>} - Expanded notation
 */
// Modified part of expandComboNotation in notationService.js
export const expandComboNotation = async (combo) => {
  if (
    !combo ||
    !combo.gameId ||
    !combo.notation ||
    !Array.isArray(combo.notation)
  ) {
    console.warn("Invalid combo provided to expandComboNotation");
    return [];
  }

  try {
    // Fetch notation data
    const notationData = await fetchGameNotationData(combo.gameId);

    console.log("Notation data structure:", notationData);

    if (!notationData) {
      console.warn(`No notation data available for game ${combo.gameId}`);
      return combo.notation.map((item) => normalizeNotationElement(item));
    }

    // Check if categories are nested differently than expected
    // If the data is nested like { categories: { buttons: [...], etc. } }
    const categories = notationData.categories || notationData;

    console.log("Using categories structure:", Object.keys(categories));

    // Expand each notation element
    return combo.notation.map((item) => {
      if (!item || !item.categoryId || !item.elementId) {
        return normalizeNotationElement(item);
      }

      // Try to find the category (handle both possible structures)
      const category =
        categories[item.categoryId] ||
        (Array.isArray(categories)
          ? categories.find((c) => c.id === item.categoryId)
          : null);

      if (!category) {
        console.warn(
          `Category not found: ${item.categoryId} (available: ${Object.keys(
            categories
          ).join(", ")})`
        );
        return normalizeNotationElement({
          ...item,
          name: item.elementId,
          symbol: item.elementId,
        });
      }

      // Check if the category is an array or needs to be accessed differently
      const elements = Array.isArray(category)
        ? category
        : category.elements || [];

      // Try to find the element
      const element = elements.find((el) => el.id === item.elementId);

      if (!element) {
        console.warn(`Element not found: ${item.categoryId}.${item.elementId}`);
        return normalizeNotationElement({
          ...item,
          name: item.elementId,
          symbol: item.elementId,
        });
      }

      // Return expanded element
      return normalizeNotationElement({
        ...item,
        ...element,
        categoryName: getCategoryName(item.categoryId),
      });
    });
  } catch (error) {
    console.error("Error in expandComboNotation:", error);
    return combo.notation.map((item) => normalizeNotationElement(item));
  }
};

/**
 * Get notation element details
 * @param {string} gameId - Game ID
 * @param {string} categoryId - Category ID
 * @param {string} elementId - Element ID
 * @returns {Promise<Object|null>} - Notation element or null if not found
 */
export const getNotationElement = async (gameId, categoryId, elementId) => {
  if (!gameId || !categoryId || !elementId) {
    return null;
  }

  try {
    // Fetch notation data
    const notationData = await fetchGameNotationData(gameId);

    if (!notationData) {
      return null;
    }

    // Find category
    const category = notationData[categoryId];
    if (!category || !Array.isArray(category)) {
      return null;
    }

    // Find element
    const element = category.find((el) => el.id === elementId);
    if (!element) {
      return null;
    }

    // Return normalized element
    return normalizeNotationElement({
      ...element,
      categoryId,
      elementId,
      categoryName: getCategoryName(categoryId),
    });
  } catch (error) {
    console.error(
      `Error in getNotationElement for ${gameId}/${categoryId}/${elementId}:`,
      error
    );
    return null;
  }
};

/**
 * Clear notation cache
 * @param {string} [gameId] - Optional game ID to clear specific cache entry
 */
export const clearNotationCache = (gameId) => {
  if (gameId) {
    notationCache.delete(gameId);
  } else {
    notationCache.clear();
  }
};
