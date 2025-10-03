import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { MovieCarousel } from "@/components/movie-carousel";
import { LoadingSpinner } from "@/components/loading-spinner";
// stop using mock-data for visible lists; rely on API
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchDiscoverByGenre,
  fetchMovieDetails,
} from "@/lib/api";
import MovieListsHydrator from "./_movieListsHydrator";

export default async function HomePage() {
  // Fetch data from TMDb proxy endpoints on the server
  const [
    trendingMovies,
    topRatedMovies,
    actionMovies,
    dramaMovies,
    sciFiMovies,
  ] = await Promise.all([
    fetchTrendingMovies().catch(() => []),
    fetchTopRatedMovies().catch(() => []),
    fetchDiscoverByGenre(28).catch(() => []),
    fetchDiscoverByGenre(18).catch(() => []),
    fetchDiscoverByGenre(878).catch(() => []),
  ]);

  // If TMDb returned empty lists (no API key or failure), fall back to a small curated
  // set of IMDb ids and fetch combined details so the homepage still displays movies.
  const needFallback =
    !(trendingMovies && trendingMovies.length) &&
    !(topRatedMovies && topRatedMovies.length);

  let fallbackMovies: any[] = [];
  if (needFallback) {
    const fallbackImdbIds = [
      "tt0111161", // The Shawshank Redemption
      "tt0068646", // The Godfather
      "tt0071562", // The Godfather: Part II
      "tt0468569", // The Dark Knight
      "tt0109830", // Forrest Gump
    ];
    try {
      const fetched = await Promise.all(
        fallbackImdbIds.map((id) =>
          fetchMovieDetails({ i: id }).catch(() => null)
        )
      );
      fallbackMovies = fetched.filter(Boolean) as any[];
    } catch (e) {
      // ignore
      fallbackMovies = [];
    }
  }

  // Prefer top rated for hero if trending is empty
  const trending = trendingMovies || [];
  const topRated = (topRatedMovies || [])
    .slice()
    .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0));
  const featuredMovies = trending.length
    ? trending.slice(0, 5)
    : topRated.slice(0, 5);
  // If we used fallback, override featured/trending/topRated with fallback data
  const finalTrending = trending.length ? trending : fallbackMovies;
  const finalTopRated = topRated.length ? topRated : fallbackMovies;
  const action = actionMovies || [];
  const drama = dramaMovies || [];
  const scifi = sciFiMovies || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-8">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <HeroSection
              movies={
                featuredMovies.length
                  ? featuredMovies
                  : finalTopRated.slice(0, 5)
              }
            />
          </Suspense>
        </section>

        {/* Movie Carousels */}
        <div className="space-y-12">
          <section className="container mx-auto px-6">
            <Suspense fallback={<LoadingSpinner />}>
              <MovieCarousel
                title="Trending Now"
                movies={finalTrending}
                variant="large"
                showGenres
              />
            </Suspense>
          </section>

          <section className="container mx-auto px-6">
            <Suspense fallback={<LoadingSpinner />}>
              <MovieCarousel
                title="Top Rated"
                movies={finalTopRated}
                showGenres
              />
            </Suspense>
          </section>

          <section className="container mx-auto px-6">
            <Suspense fallback={<LoadingSpinner />}>
              <MovieCarousel title="Action Movies" movies={action} />
            </Suspense>
          </section>

          <section className="container mx-auto px-6">
            <Suspense fallback={<LoadingSpinner />}>
              <MovieCarousel title="Drama" movies={drama} />
            </Suspense>
          </section>

          <section className="container mx-auto px-6">
            <Suspense fallback={<LoadingSpinner />}>
              <MovieCarousel title="Science Fiction" movies={scifi} />
            </Suspense>
          </section>
        </div>

        {/* Personalized Recommendations Section */}
        <section className="container mx-auto px-6 mt-12">
          <div className="text-center space-y-4 py-12">
            <h2 className="text-3xl font-bold text-balance">
              Discover Your Next Favorite Movie
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Explore thousands of movies, create your watchlist, and get
              personalized recommendations based on your preferences.
            </p>
          </div>
        </section>
      </main>
      {/* Client-side hydrator will render carousels if SSR had none */}
      <MovieListsHydrator
        initialTrending={trending}
        initialTopRated={topRated}
        initialAction={action}
        initialDrama={drama}
        initialSciFi={scifi}
      />
    </div>
  );
}
