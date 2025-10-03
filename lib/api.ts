// Lightweight mock-backed API wrapper.
// This module preserves the same exported function names used across the app
// but returns mock data from `lib/mock-data` and local storage helpers so the
// app no longer depends on a runtime backend for core features.

import {
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  searchMovies,
  getMovieById,
  getSimilarMovies,
  movies as allMockMovies,
} from "./mock-data";
import {
  getComments,
  addComment,
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
} from "./storage";

// Comments
export async function fetchCommentsApi(movieId: string | number) {
  try {
    return Promise.resolve(getComments(movieId) || []);
  } catch (e) {
    return Promise.resolve([]);
  }
}

export async function postCommentApi(
  movieId: string | number,
  author: string,
  text: string,
  _token?: string
) {
  try {
    const created = addComment(movieId, author, text);
    return Promise.resolve(created);
  } catch (e) {
    return Promise.reject(new Error("Failed to post comment"));
  }
}

// Auth (mocked)
export async function registerApi(
  username: string,
  email: string,
  password: string
) {
  // Simple client-side mock: return a success object. Do not persist passwords here.
  // On the client this can be extended to store minimal user info in localStorage.
  return Promise.resolve({ username, email, ok: true });
}

export async function loginApi(email: string, password: string) {
  // Return a fake access token so UI flows that expect { access } continue to work.
  const token = `mock-token:${Date.now()}`;
  try {
    saveAuthToken(token);
  } catch (e) {}
  return Promise.resolve({ access: token });
}

// Movie data helpers
export async function fetchMovieDetails(query: {
  t?: string;
  i?: string;
  tmdb_id?: string | number;
}) {
  // Try tmdb_id first
  if (query.tmdb_id) {
    const idNum = Number(query.tmdb_id);
    const byId = getMovieById(idNum);
    return Promise.resolve(byId || null);
  }

  // Title search
  if (query.t) {
    const results = searchMovies(query.t || "");
    return Promise.resolve(results.length ? results[0] : null);
  }

  // Fallback: try matching by an imdb-like id (not present in mock data), return null
  return Promise.resolve(null);
}

export async function fetchTrendingMovies() {
  try {
    return Promise.resolve(getTrendingMovies());
  } catch (e) {
    return Promise.resolve([]);
  }
}

export async function fetchTopRatedMovies() {
  try {
    return Promise.resolve(getTopRatedMovies());
  } catch (e) {
    return Promise.resolve([]);
  }
}

export async function fetchTMDbSearch(q: string) {
  try {
    return Promise.resolve(searchMovies(q));
  } catch (e) {
    return Promise.resolve([]);
  }
}

export async function fetchTMDbMovie(tmdbId: number) {
  try {
    const movie = getMovieById(tmdbId);
    const similar = getSimilarMovies(tmdbId);
    return Promise.resolve({ ...movie, similar: { results: similar } });
  } catch (e) {
    return Promise.resolve(null);
  }
}

export async function fetchDiscoverByGenre(genreId: number) {
  try {
    const list = getMoviesByGenre(genreId) || [];
    return Promise.resolve(
      (list || [])
        .slice()
        .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))
    );
  } catch (e) {
    return Promise.resolve([]);
  }
}

export default {
  fetchCommentsApi,
  postCommentApi,
  registerApi,
  loginApi,
  fetchMovieDetails,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchTMDbSearch,
  fetchTMDbMovie,
  fetchDiscoverByGenre,
};
