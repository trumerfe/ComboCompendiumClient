// src/services/apiService.js
import { auth } from "../firebase/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
};

// Helper to create headers with authentication
const createHeaders = async (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = await getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    data = null,
    requiresAuth = true,
    params = {},
  } = options;

  try {
    // Add query parameters to URL if present
    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    // Create request options
    const requestOptions = {
      method,
      headers: await createHeaders(requiresAuth),
    };

    // Add body for non-GET requests
    if (data && method !== "GET") {
      requestOptions.body = JSON.stringify(data);
    }

    console.log(`API Request: ${method} ${url.toString()}`);
    console.log("Request Options:", requestOptions);

    const response = await fetch(url, requestOptions);

    console.log("Response Status:", response.status);

    // Check if response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response Text:", errorText);
      throw new Error(errorText || "API request failed");
    }

    // Try to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      return responseData;
    } else {
      const responseText = await response.text();
      console.log("Response Text:", responseText);
      throw new Error("Response is not JSON");
    }
  } catch (error) {
    console.error(`API request error (${endpoint}):`, error);
    throw error;
  }
};

// GAMES
export const getGames = async () => {
  const response = await apiRequest("/games", { requiresAuth: false });

  // Handle API response with success, count, and data structure
  if (response && response.success && Array.isArray(response.data)) {
    console.log("Validated games:", response.data);
    return response.data;
  }

  console.error("Received invalid games data:", response);
  throw new Error("Invalid games data received");
};

export const getGameById = async (gameId) => {
  return apiRequest(`/games/${gameId}`, { requiresAuth: false });
};

export const getGameNotation = async (gameId) => {
  return apiRequest(`/games/${gameId}/notation`, { requiresAuth: false });
};

// CHARACTERS
export const getCharactersByGameId = async (gameId) => {
  const response = await apiRequest(`/games/${gameId}/characters`, {
    requiresAuth: false,
  });

  // Handle API response with success, count, and data structure
  if (response && response.success && Array.isArray(response.data)) {
    console.log("Validated characters:", response.data);
    return response.data;
  }

  console.error("Received invalid characters data:", response);
  throw new Error("Invalid characters data received");
};

export const getCharacterById = async (characterId) => {
  const response = await apiRequest(`/characters/${characterId}`, {
    requiresAuth: false,
  });

  // Handle API response with success and data
  if (response && response.success && response.data) {
    console.log("Validated character:", response.data);
    return response.data;
  }

  console.error("Received invalid character data:", response);
  throw new Error("Invalid character data received");
};

// NOTATION
export const getNotationElement = async (gameId, categoryId, elementId) => {
  return apiRequest(`/games/${gameId}/notation/${categoryId}/${elementId}`, {
    requiresAuth: false,
  });
};

export const getNotationDataForComboBuilder = async (gameId, characterId) => {
  return apiRequest(
    `/games/${gameId}/notationForComboBuilder/${characterId}`, 
    { requiresAuth: false }
  );
};

// COMBOS
export const getCombosByCharacterId = async (characterId, options = {}) => {
  return apiRequest(`/characters/${characterId}/combos`, {
    requiresAuth: false,
    params: options,
  });
};

export const getComboById = async (comboId) => {
  return apiRequest(`/combos/${comboId}`, { requiresAuth: false });
};

export const getExpandedCombo = async (comboId) => {
  return apiRequest(`/combos/${comboId}/expanded`, { requiresAuth: false });
};

export const createCombo = async (comboData) => {
  return apiRequest("/combos", {
    method: "POST",
    data: comboData,
    requiresAuth: true,
  });
};

export const updateCombo = async (comboId, comboData) => {
  return apiRequest(`/combos/${comboId}`, {
    method: "PUT",
    data: comboData,
    requiresAuth: true,
  });
};

export const likeCombo = async (comboId) => {
  try {
    const response = await apiRequest(`/combos/${comboId}/like`, {
      method: "PUT", // Changed from POST to PUT
      requiresAuth: true,
    });

    return response;
  } catch (error) {
    console.error(`Error liking combo ${comboId}:`, error);
    throw error;
  }
};

export const dislikeCombo = async (comboId) => {
  try {
    const response = await apiRequest(`/combos/${comboId}/dislike`, {
      method: "PUT", // Changed from POST to PUT
      requiresAuth: true,
    });

    return response;
  } catch (error) {
    console.error(`Error disliking combo ${comboId}:`, error);
    throw error;
  }
};

// USER FAVORITES
export const getUserFavorites = async () => {
  return apiRequest("/users/favorites", { requiresAuth: true });
};

export const addFavoriteCharacter = async (characterId) => {
  return apiRequest("/users/favorites/characters", {
    method: "POST",
    data: { characterId },
    requiresAuth: true,
  });
};

export const removeFavoriteCharacter = async (characterId) => {
  return apiRequest(`/users/favorites/characters/${characterId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};

export const addFavoriteCombo = async (comboId) => {
  return apiRequest("/users/favorites/combos", {
    method: "POST",
    data: { comboId },
    requiresAuth: true,
  });
};

export const removeFavoriteCombo = async (comboId) => {
  return apiRequest(`/users/favorites/combos/${comboId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};
