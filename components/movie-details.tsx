"use client";

import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MovieCarousel } from "./movie-carousel";
import {
  Play,
  Heart,
  Plus,
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { genres } from "@/lib/mock-data";
import { fetchTMDbMovie } from "@/lib/api";
import { cn } from "@/lib/utils";
import { routeIdForMovie } from "@/lib/utils";
import { fullImageUrl, fullBackdropUrl } from "@/lib/image";
import Link from "next/link";
import { getComments, addComment, getAuthToken } from "@/lib/storage";
import { fetchCommentsApi, postCommentApi } from "@/lib/api";
import type { Comment } from "@/lib/types";

interface MovieDetailsProps {
  movie: Movie;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const { userData, toggleFavorite, toggleWatchlist, rateMovie } =
    useUserData();

  const movieKey = routeIdForMovie(movie);
  const isFavorite = userData?.favorites?.includes(movieKey) || false;
  const isInWatchlist = userData?.watchlist?.includes(movieKey) || false;
  const userRating = userData?.ratings?.[movieKey] || 0;
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);

  // Helper to format nullable numbers
  const fmtNumber = (
    v: number | null | undefined,
    decimals = 1,
    fallback = "N/A"
  ) => {
    if (v === null || v === undefined || Number.isNaN(Number(v)))
      return fallback;
    try {
      return Number(v).toFixed(decimals);
    } catch (e) {
      return fallback;
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadSimilar = async () => {
      // Attempt to fetch similar movies via the TMDb helper (mocked when no backend)
      try {
        const td = await fetchTMDbMovie((movie as any).tmdb_id);
        const sims = td?.similar?.results || [];
        if (mounted && Array.isArray(sims)) setSimilarMovies(sims);
        return;
      } catch (err) {
        console.warn(
          "Failed to load TMDb similar movies, falling back to local mock",
          err
        );
      }
    };
    void loadSimilar();
    return () => {
      mounted = false;
    };
  }, [movie]);

  const movieGenres = (movie.genre_ids || [])
    .map((id) => genres.find((g) => g.id === id))
    .filter(Boolean as any);

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    rateMovie(movieKey as any, rating);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchCommentsApi(movieKey);
        if (mounted && Array.isArray(data)) {
          setComments(data as Comment[]);
          return;
        }
      } catch (err) {
        // fallback to localStorage
        console.warn(
          "Failed to load comments from API/mock, falling back to localStorage",
          err
        );
      }

      const loaded = getComments(movieKey) || [];
      if (mounted) setComments(loaded);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [movie.id]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const name = author.trim() || "Anonymous";

    const post = async () => {
      try {
        const token = getAuthToken();
        const created = await postCommentApi(
          movieKey,
          name,
          commentText.trim(),
          token || undefined
        );
        setComments((c) => [created as Comment, ...c]);
        setCommentText("");
        return;
      } catch (err) {
        console.warn(
          "Failed to post comment to API/mock, falling back to localStorage",
          err
        );
      }

      const newC = addComment(movieKey, name, commentText.trim());
      if (newC) {
        setComments((c) => [newC as Comment, ...c]);
        setCommentText("");
      }
    };

    void post();
  };

  const shareMovie = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={fullBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Poster */}
              <div className="flex-shrink-0">
                <Image
                  src={fullImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-4 text-white">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-xl text-white/80 italic text-pretty">
                    {movie.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  {movie.vote_average !== undefined &&
                    movie.vote_average !== null && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {fmtNumber(movie.vote_average, 1)}
                        </span>
                        <span className="text-sm">
                          {movie.vote_count != null
                            ? `(${movie.vote_count.toLocaleString()} votes)`
                            : "(N/A votes)"}
                        </span>
                      </div>
                    )}

                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}

                  {movie.runtime && typeof movie.runtime === "number" && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movieGenres.map((genre) => (
                    <Badge
                      key={genre!.id}
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {genre!.name}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {movie.videos && movie.videos.length > 0 ? (
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Trailer
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">
                      No trailer available
                    </span>
                  )}

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => toggleFavorite(movieKey as any)}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 mr-2",
                        isFavorite && "fill-red-500 text-red-500"
                      )}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => toggleWatchlist(movieKey as any)}
                  >
                    <Plus
                      className={cn(
                        "w-5 h-5 mr-2",
                        isInWatchlist && "text-primary"
                      )}
                    />
                    {isInWatchlist
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    onClick={shareMovie}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 space-y-8">
        {/* Overview and Rating */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                {movie.overview}
              </p>
            </div>

            {/* Comments */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>

              <div className="space-y-3 mb-4">
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-3 py-2 rounded border bg-background"
                />

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 rounded border bg-background"
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button onClick={handleAddComment}>Post Comment</Button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first!
                  </p>
                )}
                {comments.map((c) => (
                  <Card key={c.id} className="bg-card">
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{c.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="max-w-xl text-base text-pretty">
                          {c.text}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.cast.slice(0, 6).map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {member.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                                alt={member.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.character}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rate this movie</h3>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6",
                          userRating >= star || selectedRating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground hover:text-yellow-400"
                        )}
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You rated this movie {userRating} star
                    {userRating !== 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Movie Stats */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Movie Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">
                      {movie.vote_average != null
                        ? `${fmtNumber(movie.vote_average, 1)}/10`
                        : "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Votes</span>
                    <span className="font-medium">
                      {movie.vote_count != null
                        ? movie.vote_count.toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Popularity</span>
                    <span className="font-medium">
                      {movie.popularity != null
                        ? fmtNumber(movie.popularity, 1)
                        : "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date</span>
                    <span className="font-medium">
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <MovieCarousel
              title="Similar Movies"
              movies={similarMovies}
              showGenres
            />
          </div>
        )}
      </div>
    </div>
  );
}
