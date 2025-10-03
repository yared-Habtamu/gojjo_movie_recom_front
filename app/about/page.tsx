"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, Heart, Users, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Film className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Gojjo Cinema</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal movie companion for discovering, tracking, and enjoying the best films from around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To help movie enthusiasts discover their next favorite film through personalized recommendations,
                comprehensive movie information, and seamless tracking of their viewing journey.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Personalized movie recommendations</li>
                <li>• Advanced search and filtering</li>
                <li>• Favorites and watchlist management</li>
                <li>• Detailed movie information</li>
                <li>• Offline-ready PWA experience</li>
              </ul>
            </CardContent>
          </Card>

          {/* Community */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join thousands of movie lovers who use Gojjo Cinema to discover new films, track their viewing progress,
                and never miss a great movie again.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Built with Modern Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Frontend Technologies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Next.js 15 with App Router</li>
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Progressive Web App (PWA)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Features & Capabilities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Offline functionality</li>
                  <li>• Dark/Light mode support</li>
                  <li>• Responsive design</li>
                  <li>• Local data persistence</li>
                  <li>• Installable on devices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Attribution */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Data Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">The Movie Database (TMDb)</h3>
                <p className="text-muted-foreground mb-4">
                  This product uses the TMDb API but is not endorsed or certified by TMDb. All movie data, images, and
                  information are provided by The Movie Database.
                </p>
                <Button variant="outline" asChild>
                  <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
                    Visit TMDb
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Movie Journey?</h2>
          <p className="text-muted-foreground mb-6">Join Gojjo Cinema today and discover your next favorite film.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Browse Movies</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
