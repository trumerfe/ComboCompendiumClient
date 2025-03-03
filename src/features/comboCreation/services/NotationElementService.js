// src/features/comboBuilder/services/NotationElementService.js
// or src/features/comboCreation/services/NotationElementService.js (depending on your path)

/**
 * Service for handling notation element retrieval and rendering
 */
import { getNotationElement as getNotationElementFromAPI } from "../../../services/apiService";

/**
 * Gets a specific notation element with all its display properties
 * @param {string} gameId - The game the element belongs to
 * @param {string} categoryId - The category of the element
 * @param {string} elementId - The id of the element
 * @returns {Promise<Object>} - The notation element with display properties
 */
export const fetchNotationElement = async (gameId, categoryId, elementId) => {
  try {
    // Call the API service to get the element
    const response = await getNotationElementFromAPI(
      gameId,
      categoryId,
      elementId
    );

    // Check for success response from new API format
    if (!response.success || !response.data) {
      console.warn(`Element not found: ${categoryId}:${elementId}`);
      return null;
    }

    // Return the element with categoryId and elementId included for reference
    return {
      ...response.data,
      categoryId,
      elementId,
    };
  } catch (error) {
    console.error(
      `Error retrieving notation element ${categoryId}:${elementId}:`,
      error
    );
    return null;
  }
};

/**
 * Validates if an image URL exists or is valid
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether the URL is valid
 */
export const validateImageUrl = async (url) => {
  if (!url) return false;

  // For mock purposes, since we're dealing with mock URLs
  // In a real app, you might want to actually check if the image exists
  return url.startsWith("/images/") || url.startsWith("http");
};

/**
 * Normalizes a notation element to ensure it has all required properties
 * This is crucial for consistent rendering
 * @param {Object} element - The notation element
 * @returns {Object} - Normalized notation element
 */
export const normalizeNotationElement = (element) => {
  if (!element) return null;
  
  // Handle the nested element structure from expandedNotation
  if (element.element) {
    return {
      id: element.elementId || element.id || '',
      elementId: element.elementId || element.id || '',
      categoryId: element.categoryId || 'unknown',
      name: element.element.name || element.name || element.id || 'Unknown',
      symbol: element.element.symbol || element.symbol || element.id || '',
      imageUrl: element.element.imageUrl || element.imageUrl || null,
      display: element.display || '',
      description: element.description || element.element.description || ''
    };
  }
  
  // Regular normalization
  return {
    id: element.id || element.elementId || '',
    elementId: element.elementId || element.id || '',
    categoryId: element.categoryId || 'unknown',
    name: element.name || element.id || 'Unknown',
    symbol: element.symbol || element.id || '',
    imageUrl: element.imageUrl || null,
    display: element.display || '',
    description: element.description || ''
  };
};

/**
 * Determines if a notation element has valid image data
 * @param {Object} element - The notation element
 * @returns {boolean} - Whether the element has valid image data
 */
export const hasValidImage = (element) => {
  return (
    element && element.imageUrl && element.imageUrl.toString().trim() !== ""
  );
};

/**
 * Gets the appropriate rendering for a notation element
 * Following the fallback flow: image → symbol → id → name
 * @param {Object} element - The notation element
 * @returns {Object} - Rendering information with fallback priority
 */
export const getElementRenderer = (element) => {
  if (!element) {
    return { fallbackType: "text", fallbackContent: "?" };
  }

  // Normalize the element first
  const normalizedElement = normalizeNotationElement(element);

  return {
    // The normalized element has all possible rendering options
    // The components will handle the fallback priority
    element: normalizedElement,

    // For backwards compatibility
    fallbackType: hasValidImage(normalizedElement)
      ? "image"
      : normalizedElement.symbol && normalizedElement.symbol.trim() !== ""
      ? "symbol"
      : normalizedElement.id && normalizedElement.id.trim() !== ""
      ? "id"
      : "name",

    fallbackContent: hasValidImage(normalizedElement)
      ? normalizedElement.imageUrl
      : normalizedElement.symbol && normalizedElement.symbol.trim() !== ""
      ? normalizedElement.symbol
      : normalizedElement.id && normalizedElement.id.trim() !== ""
      ? normalizedElement.id
      : normalizedElement.name || "Unknown",
  };
};