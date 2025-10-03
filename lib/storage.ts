import type { UserData, UserPreferences } from "./types";

const STORAGE_KEYS = {
  USER_DATA: "gojjo_cinema_user_data",
  PREFERENCES: "gojjo_cinema_preferences",
  COMMENTS: "gojjo_cinema_comments",
};

const defaultPreferences: UserPreferences = {
  favoriteGenres: [],
  language: "en",
  darkMode: true,
  notifications: true,
};

const defaultUserData: UserData = {
  favorites: [],
  watchlist: [],
  ratings: {},
  preferences: defaultPreferences,
};

export const getUserData = (): UserData => {
  if (typeof window === "undefined") return defaultUserData;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return stored
      ? { ...defaultUserData, ...JSON.parse(stored) }
      : defaultUserData;
  } catch {
    return defaultUserData;
  }
};

export const saveUserData = (userData: UserData): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
};

export const toggleFavorite = (movieId: string | number): void => {
  const userData = getUserData();
  const key = String(movieId);
  const favorites = userData.favorites.includes(key)
    ? userData.favorites.filter((id) => id !== key)
    : [...userData.favorites, key];

  saveUserData({ ...userData, favorites });
};

export const toggleWatchlist = (movieId: string | number): void => {
  const userData = getUserData();
  const key = String(movieId);
  const watchlist = userData.watchlist.includes(key)
    ? userData.watchlist.filter((id) => id !== key)
    : [...userData.watchlist, key];

  saveUserData({ ...userData, watchlist });
};

export const rateMovie = (movieId: string | number, rating: number): void => {
  const userData = getUserData();
  const key = String(movieId);
  const ratings = { ...userData.ratings, [key]: rating };

  saveUserData({ ...userData, ratings });
};

export const updatePreferences = (
  preferences: Partial<UserPreferences>
): void => {
  const userData = getUserData();
  const updatedPreferences = { ...userData.preferences, ...preferences };

  saveUserData({ ...userData, preferences: updatedPreferences });
};

// Comments helpers
export const getComments = (movieId: string | number) => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const allComments = stored ? JSON.parse(stored) : {};
    const key = String(movieId);
    return allComments[key] || [];
  } catch (error) {
    console.error("Failed to load comments:", error);
    return [];
  }
};

// Simple token storage helpers
export const saveAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("gojjo_cinema_token", token);
  try {
    // Notify other components in the same window that auth changed
    window.dispatchEvent(new CustomEvent("gojjo:auth-changed"));
  } catch (e) {
    // ignore
  }
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gojjo_cinema_token");
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gojjo_cinema_token");
  try {
    window.dispatchEvent(new CustomEvent("gojjo:auth-changed"));
  } catch (e) {
    // ignore
  }
};

export const addComment = (
  movieId: string | number,
  author: string,
  text: string
) => {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const allComments: Record<string, any> = stored ? JSON.parse(stored) : {};
    const key = String(movieId);
    const commentsForMovie = allComments[key] || [];

    const newComment = {
      id: `${key}-${Date.now()}`,
      movieId: key,
      author,
      text,
      createdAt: new Date().toISOString(),
    };

    allComments[key] = [newComment, ...commentsForMovie];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    return newComment;
  } catch (error) {
    console.error("Failed to save comment:", error);
  }
};
