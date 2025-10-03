"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Heart,
  Bookmark,
  User,
  Menu,
  X,
  Film,
  Sparkles,
  Settings,
  LogIn,
  UserPlus,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthToken } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];

const additionalItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

const authItems = [
  { href: "/login", label: "Sign In", icon: LogIn },
  { href: "/signup", label: "Sign Up", icon: UserPlus },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const check = () => {
      try {
        const token = localStorage.getItem("gojjo_cinema_token");
        setIsLoggedIn(!!token);
      } catch (e) {
        setIsLoggedIn(false);
      }
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gojjo_cinema_token") check();
    };
    const onCustom = () => check();
    window.addEventListener("storage", onStorage);
    window.addEventListener("gojjo:auth-changed", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "gojjo:auth-changed",
        onCustom as EventListener
      );
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">Gojjo Cinema</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              {!isLoggedIn && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  {authItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.href}
                        variant={
                          item.href === "/signup" ? "default" : "outline"
                        }
                        size="sm"
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}
              {isLoggedIn && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      try {
                        clearAuthToken();
                        toast({ title: "Logged out successfully" });
                        setTimeout(() => router.push("/login"), 400);
                      } catch (e) {
                        // still navigate
                        router.push("/login");
                      }
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-card border-l border-border p-6">
            <div className="flex flex-col gap-4 mt-16">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-border my-2" />

              {additionalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-border my-2" />

              {!isLoggedIn &&
                authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden backdrop-blur-glass border-t border-border/50">
        <div className="flex items-center justify-around py-2">
          {[navItems[0], navItems[1], navItems[4], navItems[5]].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
