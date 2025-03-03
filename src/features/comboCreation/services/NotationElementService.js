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
      id: element.elementId || element.id || "",
      elementId: element.elementId || element.id || "",
      categoryId: element.categoryId || "unknown",
      name: element.element.name || element.name || element.id || "Unknown",
      symbol: element.element.symbol || element.symbol || element.id || "",
      numpad: element.element.numpad || element.numpad || "", // Add numpad property
      imageUrl: element.element.imageUrl || element.imageUrl || null,
      display: element.display || "",
      description: element.description || element.element.description || "",
    };
  }

  // Regular normalization
  return {
    id: element.id || element.elementId || "",
    elementId: element.elementId || element.id || "",
    categoryId: element.categoryId || "unknown",
    name: element.name || element.id || "Unknown",
    symbol: element.symbol || element.id || "",
    numpad: element.numpad || "", // Add numpad property
    imageUrl: element.imageUrl || null,
    display: element.display || "",
    description: element.description || "",
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
 * Determines if a notation element has valid numpad data
 * @param {Object} element - The notation element
 * @returns {boolean} - Whether the element has valid numpad data
 */
export const hasValidNumpad = (element) => {
  return element && element.numpad && element.numpad.toString().trim() !== "";
};

/**
 * Gets the appropriate rendering for a notation element
 * Following the fallback flow: image → numpad (if showNumpad) → symbol → id → name
 * @param {Object} element - The notation element
 * @param {boolean} showNumpad - Whether to prioritize numpad notation
 * @returns {Object} - Rendering information with fallback priority
 */
export const getElementRenderer = (element, showNumpad = false) => {
  if (!element) {
    return { fallbackType: "text", fallbackContent: "?" };
  }

  // Normalize the element first
  const normalizedElement = normalizeNotationElement(element);

  // Determine fallback type, now including numpad if showNumpad is true
  let fallbackType = "name";
  let fallbackContent = normalizedElement.name || "Unknown";

  if (hasValidImage(normalizedElement)) {
    fallbackType = "image";
    fallbackContent = normalizedElement.imageUrl;
  } else if (showNumpad && hasValidNumpad(normalizedElement)) {
    fallbackType = "numpad";
    fallbackContent = normalizedElement.numpad;
  } else if (
    normalizedElement.symbol &&
    normalizedElement.symbol.trim() !== ""
  ) {
    fallbackType = "symbol";
    fallbackContent = normalizedElement.symbol;
  } else if (normalizedElement.id && normalizedElement.id.trim() !== "") {
    fallbackType = "id";
    fallbackContent = normalizedElement.id;
  }

  return {
    // The normalized element has all possible rendering options
    element: normalizedElement,
    fallbackType,
    fallbackContent,
    // Add numpad specific properties
    hasNumpad: hasValidNumpad(normalizedElement),
    numpad: normalizedElement.numpad || "",
  };
};

/**
 * Gets display value for a notation element with numpad support
 * @param {Object} element - The notation element
 * @param {boolean} showNumpad - Whether to prioritize numpad notation
 * @returns {string} - The display value to use
 */
export const getElementDisplayValue = (element, showNumpad = false) => {
  if (!element) return "?";

  const normalizedElement = normalizeNotationElement(element);

  // If showing numpad and it exists, prioritize it
  if (showNumpad && hasValidNumpad(normalizedElement)) {
    return normalizedElement.numpad;
  }

  // Otherwise follow normal fallback order
  return (
    normalizedElement.symbol ||
    normalizedElement.id ||
    normalizedElement.name ||
    "?"
  );
};
