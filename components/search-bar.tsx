"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  autoFocus?: boolean
}

export function SearchBar({
  placeholder = "Search movies...",
  onSearch,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query.trim())
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className={cn("relative flex items-center transition-all duration-200", isFocused && "scale-105")}>
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10 h-12 bg-background/50 backdrop-blur-sm border-border/50",
            "focus:bg-background focus:border-primary/50 transition-all duration-200",
          )}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 w-8 h-8 p-0"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  )
}
