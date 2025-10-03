"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { MovieCard } from "@/components/movie-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUserData } from "@/hooks/use-user-data"
import { movies, genres } from "@/lib/mock-data"
import { Sparkles, RefreshCw, TrendingUp, Heart } from "lucide-react"
import type { Movie } from "@/lib/types"

export default function RecommendationsPage() {
  const { userData, isLoading } = useUserData()
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendations = () => {
    if (!userData) return

    setIsGenerating(true)

    // Simulate recommendation generation
    setTimeout(() => {
      const favoriteGenres = userData.preferences.favoriteGenres
      const favoriteMovies = userData.favorites
      const ratedMovies = Object.keys(userData.ratings).map(Number)

      // Filter movies based on user preferences
      let recommendedMovies = movies.filter((movie) => {
        // Exclude already favorited or rated movies
        if (favoriteMovies.includes(String(movie.id)) || ratedMovies.includes(Number(movie.id))) {
          return false
        }

        // Include movies from favorite genres
        if (favoriteGenres.length > 0) {
          return movie.genre_ids.some((genreId) => favoriteGenres.includes(genreId))
        }

        // Default to popular movies
        return movie.vote_average >= 7.0
      })

      // Sort by rating and popularity
      recommendedMovies = recommendedMovies.sort((a, b) => b.vote_average - a.vote_average).slice(0, 12)

      setRecommendations(recommendedMovies)
      setIsGenerating(false)
    }, 1000)
  }

  useEffect(() => {
    if (userData && !isLoading) {
      generateRecommendations()
    }
  }, [userData, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const favoriteGenreNames =
    userData?.preferences.favoriteGenres.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean) || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Personalized Recommendations</h1>
              <p className="text-muted-foreground">Movies picked just for you</p>
            </div>
          </div>
          <Button onClick={generateRecommendations} disabled={isGenerating} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Generating..." : "Refresh"}
          </Button>
        </div>

        {/* Recommendation Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Favorite Genres
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteGenreNames.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {favoriteGenreNames.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                  {favoriteGenreNames.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{favoriteGenreNames.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Set your favorite genres in your profile for better recommendations
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Movies Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(userData?.ratings || {}).length}</div>
              <p className="text-xs text-muted-foreground">Rate more movies to improve recommendations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground">New movies to discover</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        {isGenerating ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <p className="text-sm text-muted-foreground">Based on your preferences and ratings</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {recommendations.map((movie) => (
                <MovieCard key={String(movie.id)} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground mb-6">To get personalized recommendations, try:</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Set your favorite genres in your profile</li>
                <li>• Rate some movies you've watched</li>
                <li>• Add movies to your favorites</li>
              </ul>
              <Button onClick={generateRecommendations}>Generate Recommendations</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
