import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Film, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-12 pb-20 md:pb-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Film className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Movie Not Found</h1>
                <p className="text-muted-foreground text-pretty">
                  Sorry, we couldn't find the movie you're looking for. It might have been removed or doesn't exist.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/" className="w-full">
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>

                <Link href="/search" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Search className="w-4 h-4 mr-2" />
                    Search Movies
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
