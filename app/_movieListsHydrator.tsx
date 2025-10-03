"use client";

import { useEffect, useState } from "react";
import { MovieCarousel } from "@/components/movie-carousel";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchDiscoverByGenre,
} from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Props {
  initialTrending: any[];
  initialTopRated: any[];
  initialAction: any[];
  initialDrama: any[];
  initialSciFi: any[];
}

export default function MovieListsHydrator({
  initialTrending,
  initialTopRated,
  initialAction,
  initialDrama,
  initialSciFi,
}: Props) {
  const [trending, setTrending] = useState<any[]>(initialTrending || []);
  const [topRated, setTopRated] = useState<any[]>(initialTopRated || []);
  const [action, setAction] = useState<any[]>(initialAction || []);
  const [drama, setDrama] = useState<any[]>(initialDrama || []);
  const [scifi, setScifi] = useState<any[]>(initialSciFi || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // If server already provided data, no need to re-load
      if ((trending && trending.length) || (topRated && topRated.length))
        return;
      setLoading(true);
      try {
        const [t, top, a, d, s] = await Promise.all([
          fetchTrendingMovies().catch(() => []),
          fetchTopRatedMovies().catch(() => []),
          fetchDiscoverByGenre(28).catch(() => []),
          fetchDiscoverByGenre(18).catch(() => []),
          fetchDiscoverByGenre(878).catch(() => []),
        ]);
        if (!mounted) return;
        setTrending(t || []);
        setTopRated(
          (top || [])
            .slice()
            .sort(
              (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
            )
        );
        setAction(a || []);
        setDrama(d || []);
        setScifi(s || []);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !trending.length && !topRated.length) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {trending.length > 0 && (
        <section className="container mx-auto px-6">
          <MovieCarousel
            title="Trending Now"
            movies={trending}
            variant="large"
            showGenres
          />
        </section>
      )}
      {topRated.length > 0 && (
        <section className="container mx-auto px-6">
          <MovieCarousel title="Top Rated" movies={topRated} showGenres />
        </section>
      )}
      {action.length > 0 && (
        <section className="container mx-auto px-6">
          <MovieCarousel title="Action Movies" movies={action} />
        </section>
      )}
      {drama.length > 0 && (
        <section className="container mx-auto px-6">
          <MovieCarousel title="Drama" movies={drama} />
        </section>
      )}
      {scifi.length > 0 && (
        <section className="container mx-auto px-6">
          <MovieCarousel title="Science Fiction" movies={scifi} />
        </section>
      )}
    </div>
  );
}
