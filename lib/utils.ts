import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function routeIdForMovie(movie: any): string {
  if (!movie) return "";
  // Prefer canonical IMDb id when available (e.g., "tt0499549").
  if (typeof movie.id === "string" && movie.id.startsWith("tt"))
    return movie.id;
  // Some combined endpoints may store imdb as movie.imdb_id
  if (typeof movie.imdb_id === "string" && movie.imdb_id.startsWith("tt"))
    return movie.imdb_id;
  // Fall back to TMDb id if present
  if (movie.tmdb_id) return String(movie.tmdb_id);
  // Last resort: stringified id
  return String(movie.id || "");
}
