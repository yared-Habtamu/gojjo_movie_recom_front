"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { SearchBar } from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchMovies, getMoviesByGenre, genres } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"
import { Filter, X, SearchIcon } from "lucide-react"

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("all") // Updated default value
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let results: Movie[] = []

    if (query.trim()) {
      results = searchMovies(query)
    } else if (selectedGenre !== "all") {
      // Updated condition
      results = getMoviesByGenre(Number.parseInt(selectedGenre))
    }

    // Apply sorting
    results = sortMovies(results, sortBy)

    setSearchResults(results)
    setIsLoading(false)
  }

  const sortMovies = (movies: Movie[], sortType: string): Movie[] => {
    const sorted = [...movies]

    switch (sortType) {
      case "popularity":
        return sorted.sort((a, b) => b.popularity - a.popularity)
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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    performSearch(query)
  }

  const handleGenreFilter = (genreId: string) => {
    setSelectedGenre(genreId)
    if (genreId !== "all") {
      // Updated condition
      const results = getMoviesByGenre(Number.parseInt(genreId))
      setSearchResults(sortMovies(results, sortBy))
    } else {
      performSearch(searchQuery)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setSearchResults((prev) => sortMovies(prev, newSortBy))
  }

  const clearFilters = () => {
    setSelectedGenre("all") // Updated default value
    setSortBy("popularity")
    performSearch(searchQuery)
  }

  const hasActiveFilters = selectedGenre !== "all" || sortBy !== "popularity" // Updated condition

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Search Header */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Discover Movies</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Search through thousands of movies and find your next favorite film
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search for movies, actors, directors..." onSearch={handleSearch} autoFocus />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {(selectedGenre !== "all" ? 1 : 0) + (sortBy !== "popularity" ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>

            {searchResults.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {searchResults.length} movie{searchResults.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Genre</label>
                    <Select value={selectedGenre} onValueChange={handleGenreFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All genres</SelectItem> {/* Updated value */}
                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id.toString()}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="release_date">Release Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="mt-8">
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard key={String(movie.id)} movie={movie} variant="default" showGenres />
              ))}
            </div>
          ) : searchQuery || selectedGenre !== "all" ? ( // Updated condition
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No movies found</h3>
              <p className="text-muted-foreground text-pretty">
                {searchQuery
                  ? `No movies found for "${searchQuery}". Try a different search term.`
                  : "No movies found for the selected filters. Try adjusting your criteria."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Popular Genres */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genres.slice(0, 8).map((genre) => (
                    <Button
                      key={genre.id}
                      variant="outline"
                      className="h-auto p-4 justify-start bg-transparent"
                      onClick={() => handleGenreFilter(genre.id.toString())}
                    >
                      {genre.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search Suggestions */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"].map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <SearchContent />
    </Suspense>
  )
}
