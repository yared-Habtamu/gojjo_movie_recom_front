"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-12 pb-20 md:pb-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <WifiOff className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">You're Offline</h1>
                <p className="text-muted-foreground text-pretty">
                  It looks like you've lost your internet connection. Don't worry, you can still browse your favorites
                  and watchlist.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => window.location.reload()} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Available offline features:</p>
                <ul className="mt-2 space-y-1">
                  <li>• View your favorites</li>
                  <li>• Browse your watchlist</li>
                  <li>• Access your profile</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
