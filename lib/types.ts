export interface Movie {
  id: number | string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  cast?: CastMember[];
  crew?: CrewMember[];
  videos?: Video[];
  similar?: Movie[];
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface UserPreferences {
  favoriteGenres: number[];
  language: string;
  darkMode: boolean;
  notifications: boolean;
}

export interface UserData {
  favorites: string[];
  watchlist: string[];
  ratings: Record<string, number>;
  preferences: UserPreferences;
}

export interface Comment {
  id: string;
  movieId: string | number;
  author: string;
  text: string;
  createdAt: string; // ISO timestamp
}
