import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PWAInstall } from "@/components/pwa-install"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Gojjo Cinema - Movie Recommendations",
  description: "Discover and track your favorite movies with personalized recommendations",
  generator: "Gojjo Cinema PWA",
  manifest: "/manifest.json",
  keywords: ["movies", "recommendations", "cinema", "entertainment"],
  authors: [{ name: "Gojjo Cinema Team" }],
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-192.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Gojjo Cinema" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <Suspense fallback={null}>
            {children}
            <PWAInstall />
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
