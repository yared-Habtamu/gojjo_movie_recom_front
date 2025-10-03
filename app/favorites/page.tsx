"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { MovieCard } from "@/components/movie-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserData } from "@/hooks/use-user-data"
import { fetchMovieDetails } from "@/lib/api"
import type { Movie } from "@/lib/types"
import { Heart, Filter, SortAsc } from "lucide-react"

export default function FavoritesPage() {
  const { userData, isLoading } = useUserData()
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [sortBy, setSortBy] = useState<string>("added_date")
  const [filterBy, setFilterBy] = useState<string>("all")

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!userData?.favorites || userData.favorites.length === 0) {
        setFavoriteMovies([])
        return
      }

      const promises = userData.favorites.map((id) => {
        // favorites are stored as string ids (imdb like 'tt123...', numeric tmdb ids, or 'tmdb:123')
        const sid = String(id);
        // if it looks like an imdb id (tt...) use i
        if (sid.startsWith("tt")) {
          return fetchMovieDetails({ i: sid }).catch(() => null);
        }
        // if stored as tmdb:123 use tmdb_id
        if (sid.startsWith("tmdb:") && /^[0-9]+$/.test(sid.split(":")[1] || "")) {
          return fetchMovieDetails({ tmdb_id: Number(sid.split(":")[1]) }).catch(() => null);
        }
        // if purely numeric, treat as tmdb id
        if (/^[0-9]+$/.test(sid)) {
          return fetchMovieDetails({ tmdb_id: Number(sid) }).catch(() => null);
        }
        // fallback: try title-based lookup (last resort)
        return fetchMovieDetails({ t: sid }).catch(() => null);
      })

      const results = await Promise.all(promises)
      const movies = results.filter(Boolean) as Movie[]
      // debug: log the favorites stored and what we resolved
      try {
        // eslint-disable-next-line no-console
        console.debug("Favorites ids:", userData.favorites);
  // eslint-disable-next-line no-console
  console.debug("Resolved movie ids:", movies.map((m) => m && m.id));
      } catch (e) {}
      if (!mounted) return
        // ensure consistent id types: normalize all movie.id to string for comparisons
        const normalized = movies.map((m) => ({ ...m, id: String(m.id) })) as Movie[]
        setFavoriteMovies(sortMovies(normalized as Movie[], sortBy))
    }
    void load()
    return () => {
      mounted = false
    }
  }, [userData?.favorites, sortBy])

  const sortMovies = (movies: Movie[], sortType: string): Movie[] => {
    const sorted = [...movies]

    switch (sortType) {
      case "added_date":
        // Since we don't have actual added dates, we'll use the order in favorites array
        return userData?.favorites
          ? (userData.favorites.map((id) => movies.find((m) => String(m.id) === String(id))).filter(Boolean) as Movie[])
          : sorted
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average)
      case "release_date":
        return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return sorted
    }
  }

  const filterMovies = (movies: Movie[], filterType: string): Movie[] => {
    if (filterType === "all") return movies

    const currentYear = new Date().getFullYear()

    switch (filterType) {
      case "recent":
        return movies.filter((movie) => currentYear - new Date(movie.release_date).getFullYear() <= 5)
      case "classic":
        return movies.filter((movie) => currentYear - new Date(movie.release_date).getFullYear() > 20)
      case "highly_rated":
        return movies.filter((movie) => movie.vote_average >= 8.0)
      default:
        return movies
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const displayedMovies = filterMovies(favoriteMovies, filterBy)

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
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
              <p className="text-muted-foreground">
                {favoriteMovies.length} movie{favoriteMovies.length !== 1 ? "s" : ""} in your favorites
              </p>
            </div>
          </div>

          {/* Controls */}
          {favoriteMovies.length > 0 && (
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
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="recent">Recent (Last 5 years)</SelectItem>
                    <SelectItem value="classic">Classic (20+ years old)</SelectItem>
                    <SelectItem value="highly_rated">Highly Rated (8.0+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Showing {displayedMovies.length} of {favoriteMovies.length} movies
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-8">
          {displayedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="default" showGenres />
              ))}
            </div>
          ) : favoriteMovies.length > 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No movies match your filter</h3>
              <p className="text-muted-foreground mb-4 text-pretty">
                Try adjusting your filter criteria to see more movies.
              </p>
              <Button variant="outline" onClick={() => setFilterBy("all")}>
                Show All Favorites
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Start adding movies to your favorites by clicking the heart icon on any movie card.
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
