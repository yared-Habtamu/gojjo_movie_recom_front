import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { MovieDetails } from "@/components/movie-details";
import { fetchMovieDetails } from "@/lib/api";

// Using mocked `fetchMovieDetails` from lib/api; no direct network call here.

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const rawId = params.id;

  // If client provided an imdb id (tt...), try by id first
  let movie = null;
  if (rawId.startsWith("tt")) {
    try {
      movie = await fetchMovieDetails({ i: rawId });
    } catch (err) {
      console.warn("Failed to fetch by imdb id", err);
    }
  }

  // If rawId is numeric (tmdb id), try fetching using tmdb_id so backend can map to imdb
  // support 'tmdb:123' prefix as well
  const tmdbPrefixMatch = rawId.match(/^tmdb:(\d+)$/i);
  const tmdbNumericMatch = rawId.match(/^[0-9]+$/);
  if (!movie && (tmdbPrefixMatch || tmdbNumericMatch)) {
    try {
      const tmdbId = tmdbPrefixMatch
        ? Number(tmdbPrefixMatch[1])
        : Number(rawId);
      movie = await fetchMovieDetails({ tmdb_id: tmdbId });
    } catch (err) {
      console.warn("Failed to fetch by tmdb id", err);
    }
  }

  // If not found by id, try using the combined endpoint by title (decode id as title)
  if (!movie) {
    try {
      const title = decodeURIComponent(rawId.replace(/-/g, " "));
      movie = await fetchMovieDetails({ t: title });
    } catch (err) {
      console.warn("Failed to fetch by title", err);
    }
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pb-20 md:pb-8">
        {/* MovieDetails expects the frontend Movie shape — combined endpoint maps closely */}
        <MovieDetails movie={movie} />
      </main>
    </div>
  );
}

export function generateStaticParams() {
  // In a real app, you'd fetch all movie IDs from your API
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}
