"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { MovieCard } from "@/components/movie-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useUserData } from "@/hooks/use-user-data"
import { getMovieById } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"
import { Bookmark, Filter, SortAsc, Clock } from "lucide-react"

export default function WatchlistPage() {
  const { userData, isLoading } = useUserData()
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([])
  const [sortBy, setSortBy] = useState<string>("added_date")
  const [filterBy, setFilterBy] = useState<string>("all")

  useEffect(() => {
    if (userData?.watchlist) {
      const movies = userData.watchlist.map((id) => getMovieById(Number(id))).filter(Boolean) as Movie[]

      setWatchlistMovies(sortMovies(movies, sortBy))
    }
  }, [userData?.watchlist, sortBy])

  const sortMovies = (movies: Movie[], sortType: string): Movie[] => {
    const sorted = [...movies]

    switch (sortType) {
      case "added_date":
        // Since we don't have actual added dates, we'll use the order in watchlist array
        return userData?.watchlist
          ? (userData.watchlist.map((id) => movies.find((m) => String(m.id) === String(id))).filter(Boolean) as Movie[])
          : sorted
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average)
      case "release_date":
        return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case "runtime":
        return sorted.sort((a, b) => (a.runtime || 0) - (b.runtime || 0))
      default:
        return sorted
    }
  }

  const filterMovies = (movies: Movie[], filterType: string): Movie[] => {
    if (filterType === "all") return movies

    const currentYear = new Date().getFullYear()

    switch (filterType) {
      case "recent":
        return movies.filter((movie) => currentYear - new Date(movie.release_date).getFullYear() <= 3)
      case "short":
        return movies.filter((movie) => (movie.runtime || 0) <= 120)
      case "long":
        return movies.filter((movie) => (movie.runtime || 0) > 150)
      case "highly_rated":
        return movies.filter((movie) => movie.vote_average >= 8.0)
      default:
        return movies
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const displayedMovies = filterMovies(watchlistMovies, filterBy)

  // Calculate total runtime
  const totalRuntime = watchlistMovies.reduce((total, movie) => total + (movie.runtime || 0), 0)
  const totalHours = Math.floor(totalRuntime / 60)
  const totalMinutes = totalRuntime % 60

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My Watchlist</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>
                  {watchlistMovies.length} movie{watchlistMovies.length !== 1 ? "s" : ""} to watch
                </span>
                {totalRuntime > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {totalHours > 0 && `${totalHours}h `}
                        {totalMinutes > 0 && `${totalMinutes}m`} total
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          {watchlistMovies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {watchlistMovies.filter((m) => m.vote_average >= 8.0).length} highly rated
              </Badge>
              <Badge variant="secondary">
                {
                  watchlistMovies.filter((m) => new Date().getFullYear() - new Date(m.release_date).getFullYear() <= 3)
                    .length
                }{" "}
                recent releases
              </Badge>
              <Badge variant="secondary">
                {watchlistMovies.filter((m) => (m.runtime || 0) <= 120).length} under 2 hours
              </Badge>
            </div>
          )}

          {/* Controls */}
          {watchlistMovies.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added_date">Recently Added</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="release_date">Release Date</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="runtime">Runtime</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="recent">Recent (Last 3 years)</SelectItem>
                    <SelectItem value="short">Short (&lt;= 2 hours)</SelectItem>
                    <SelectItem value="long">Long (&gt; 2.5 hours)</SelectItem>
                    <SelectItem value="highly_rated">Highly Rated (8.0+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Showing {displayedMovies.length} of {watchlistMovies.length} movies
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-8">
          {displayedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedMovies.map((movie) => (
                <MovieCard key={String(movie.id)} movie={movie} variant="default" showGenres />
              ))}
            </div>
          ) : watchlistMovies.length > 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No movies match your filter</h3>
              <p className="text-muted-foreground mb-4 text-pretty">
                Try adjusting your filter criteria to see more movies.
              </p>
              <Button variant="outline" onClick={() => setFilterBy("all")}>
                Show All Watchlist
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Add movies you want to watch later by clicking the plus icon on any movie card.
                </p>
                <Button asChild>
                  <a href="/">Discover Movies</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
