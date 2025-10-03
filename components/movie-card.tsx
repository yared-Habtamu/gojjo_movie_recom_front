"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Star, Play } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { genres } from "@/lib/mock-data";
import { cn, routeIdForMovie } from "@/lib/utils";
import { fullImageUrl } from "@/lib/image";

interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "large" | "compact";
  showGenres?: boolean;
}

export function MovieCard({
  movie,
  variant = "default",
  showGenres = false,
}: MovieCardProps) {
  const { userData, toggleFavorite, toggleWatchlist } = useUserData();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const movieKey = routeIdForMovie(movie);
  const isFavorite = userData?.favorites.includes(movieKey) || false;
  const isInWatchlist = userData?.watchlist.includes(movieKey) || false;
  const userRating = userData?.ratings?.[movieKey];

  const movieGenres = movie.genre_ids
    .map((id) => genres.find((g) => g.id === id))
    .filter(Boolean)
    .slice(0, 2);

  const cardSizes = {
    default: "w-48 h-72",
    large: "w-64 h-96",
    compact: "w-40 h-60",
  };

  const imageSizes = {
    default: { width: 192, height: 288 },
    large: { width: 256, height: 384 },
    compact: { width: 160, height: 240 },
  };

  const fmt = (v: number | null | undefined, d = 1) => {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "N/A";
    try {
      return Number(v).toFixed(d);
    } catch {
      return "N/A";
    }
  };

  return (
    <Card
      className={cn(
        "movie-card group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm",
        cardSizes[variant]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full">
        <div className="relative h-full">
          {/* Movie Poster */}
          <div className="relative h-4/5 overflow-hidden rounded-t-lg">
            <Image
              src={fullImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
                isHovered && "scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Overlay on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <Link href={`/movie/${routeIdForMovie(movie)}`}>
                <Button size="sm" className="bg-primary/90 hover:bg-primary">
                  <Play className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>

            {/* Action buttons */}
            <div
              className={cn(
                "absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(movieKey as any);
                }}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isFavorite && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWatchlist(movieKey as any);
                }}
              >
                <Plus
                  className={cn("w-4 h-4", isInWatchlist && "text-primary")}
                />
              </Button>
            </div>

            {/* Rating badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {fmt(movie.vote_average, 1)}
              </Badge>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-3 h-1/5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-balance">
                {movie.title}
              </h3>
              {showGenres && movieGenres.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {movieGenres.map((genre) => (
                    <Badge
                      key={genre!.id}
                      variant="outline"
                      className="text-xs px-1 py-0"
                    >
                      {genre!.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
