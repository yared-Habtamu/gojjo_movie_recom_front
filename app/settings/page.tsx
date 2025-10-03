"use client"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useUserData } from "@/hooks/use-user-data"
import { Settings, Moon, Sun, Bell, Globe, Trash2, Download, Upload } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { userData, isLoading, updateUserData } = useUserData()
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

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)
    handlePreferenceUpdate("darkMode", checked)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "gojjo-cinema-data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string)
            updateUserData(importedData)
            alert("Data imported successfully!")
          } catch (error) {
            alert("Error importing data. Please check the file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
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
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your Gojjo Cinema experience</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="font-medium">Push Notifications</span>
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
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download a copy of all your favorites, watchlist, and preferences
                  </p>
                  <Button variant="outline" onClick={exportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Import Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">Import your data from a previously exported file</p>
                  <Button variant="outline" onClick={importData}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>

                <Separator />

                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will permanently delete all your favorites, watchlist, ratings, and preferences. This action
                    cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" onClick={clearAllData}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">December 2024</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data Source</span>
                <span className="font-medium">The Movie Database (TMDb)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
