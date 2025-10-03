"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUserData } from "@/hooks/use-user-data"
import { genres } from "@/lib/mock-data"
import { User, Heart, Bookmark, Star, Settings, Moon, Sun, Bell, Globe, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"

export default function ProfilePage() {
  const { userData, isLoading, updateUserData } = useUserData()
  const [selectedGenres, setSelectedGenres] = useState<number[]>(userData?.preferences.favoriteGenres || [])
  const { theme, setTheme } = useTheme()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!userData) return null

  const handlePreferenceUpdate = (key: string, value: any) => {
    updateUserData({
      preferences: {
        ...userData.preferences,
        [key]: value,
      },
    })
  }

  const toggleGenre = (genreId: number) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId]

    setSelectedGenres(newGenres)
    handlePreferenceUpdate("favoriteGenres", newGenres)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      updateUserData({
        favorites: [],
        watchlist: [],
        ratings: {},
        preferences: {
          favoriteGenres: [],
          language: "en",
          darkMode: true,
          notifications: true,
        },
      })
      setSelectedGenres([])
    }
  }

  const totalRatings = Object.keys(userData.ratings).length
  const averageRating =
    totalRatings > 0 ? Object.values(userData.ratings).reduce((sum, rating) => sum + rating, 0) / totalRatings : 0

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)
    handlePreferenceUpdate("darkMode", checked)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and view your activity</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Favorites</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">{userData.favorites.length}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Watchlist</span>
                  <div className="flex items-center gap-1">
                    <Bookmark className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{userData.watchlist.length}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Movies Rated</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{totalRatings}</span>
                  </div>
                </div>
                {totalRatings > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Rating</span>
                      <span className="font-semibold">{averageRating.toFixed(1)}/5</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Favorite Genres */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Genres</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select your favorite genres to get better recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleGenre(genre.id)}
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      <span className="font-medium">Dark Mode</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
                </div>

                <Separator />

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new releases and recommendations
                    </p>
                  </div>
                  <Switch
                    checked={userData.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceUpdate("notifications", checked)}
                  />
                </div>

                <Separator />

                {/* Language */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Language</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                  <Select
                    value={userData.preferences.language}
                    onValueChange={(value) => handlePreferenceUpdate("language", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will permanently delete all your favorites, watchlist, ratings, and preferences. This action
                    cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" onClick={clearAllData}>
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
