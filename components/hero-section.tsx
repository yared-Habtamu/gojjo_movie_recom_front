"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Movie } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Heart, Star, Info } from "lucide-react"
import { useUserData } from "@/hooks/use-user-data"
import { genres } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  movies: Movie[]
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const { userData, toggleFavorite, toggleWatchlist } = useUserData()

  const currentMovie = movies[currentIndex]
  const isFavorite = userData?.favorites.includes(currentMovie?.id) || false
  const isInWatchlist = userData?.watchlist.includes(currentMovie?.id) || false

  useEffect(() => {
    if (!movies.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [movies.length])

  if (!currentMovie) return null

  const movieGenres = currentMovie.genre_ids
    .map((id) => genres.find((g) => g.id === id))
    .filter(Boolean)
    .slice(0, 3)

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          fill
          className={cn(
            "object-cover transition-all duration-1000",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
          )}
          onLoad={() => setIsLoaded(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="max-w-2xl space-y-6">
            {/* Movie Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white text-balance leading-tight">
              {currentMovie.title}
            </h1>

            {/* Movie Info */}
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              <span>{new Date(currentMovie.release_date).getFullYear()}</span>
              {currentMovie.runtime && (
                <span>
                  {Math.floor(currentMovie.runtime / 60)}h {currentMovie.runtime % 60}m
                </span>
              )}
            </div>

            {/* Genres */}
            {movieGenres.length > 0 && (
              <div className="flex gap-2">
                {movieGenres.map((genre) => (
                  <Badge key={genre!.id} variant="secondary" className="bg-white/20 text-white">
                    {genre!.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-lg text-white/90 leading-relaxed line-clamp-3 text-pretty">{currentMovie.overview}</p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href={`/movie/${currentMovie.id}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Button>
              </Link>

              <Link href={`/movie/${currentMovie.id}`}>
                <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => toggleFavorite(currentMovie.id)}
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-red-500 text-red-500")} />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => toggleWatchlist(currentMovie.id)}
              >
                <Plus className={cn("w-5 h-5", isInWatchlist && "text-primary")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-8" : "bg-white/50",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
