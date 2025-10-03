"use client"

import { useRef } from "react"
import type { Movie } from "@/lib/types"
import { MovieCard } from "./movie-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  variant?: "default" | "large" | "compact"
  showGenres?: boolean
}

export function MovieCarousel({ title, movies, variant = "default", showGenres = false }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = variant === "large" ? 280 : variant === "compact" ? 180 : 220
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  if (!movies.length) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-balance">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => scroll("left")} className="w-8 h-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => scroll("right")} className="w-8 h-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn("flex gap-4 overflow-x-auto scrollbar-hide pb-4", "scroll-smooth snap-x snap-mandatory")}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 snap-start">
            <MovieCard movie={movie} variant={variant} showGenres={showGenres} />
          </div>
        ))}
      </div>
    </div>
  )
}
