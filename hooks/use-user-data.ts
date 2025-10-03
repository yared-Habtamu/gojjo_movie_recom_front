"use client";

import { useState, useEffect } from "react";
import type { UserData } from "@/lib/types";
import { getUserData, saveUserData } from "@/lib/storage";
import { getAuthToken } from "@/lib/storage";

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const local = getUserData();
      if (!mounted) return;
      setUserData(local);
      // No backend sync: operate purely on local storage for favorites, ratings, etc.
      setIsLoading(false);
    };

    void init();
    return () => {
      mounted = false;
    };
  }, []);

  const updateUserData = (newData: Partial<UserData>) => {
    if (!userData) return;

    const updated = { ...userData, ...newData };
    setUserData(updated);
    saveUserData(updated);
  };

  const toggleFavorite = async (movieId: string | number) => {
    if (!userData) return;
    const token = getAuthToken();
    const key = String(movieId);
    // optimistic local update
    const isFav = userData.favorites.includes(key);
    const favorites = isFav
      ? userData.favorites.filter((id) => id !== key)
      : [...userData.favorites, key];
    updateUserData({ favorites });
    // purely local - no further action required
  };

  const toggleWatchlist = async (movieId: string | number) => {
    if (!userData) return;
    const key = String(movieId);
    // watchlist stored locally only for now (backend model exists but no dedicated endpoint)
    const watchlist = userData.watchlist.includes(key)
      ? userData.watchlist.filter((id) => id !== key)
      : [...userData.watchlist, key];
    updateUserData({ watchlist });
    // TODO: optionally persist to backend when model routes exist
  };

  const rateMovie = async (movieId: string | number, rating: number) => {
    if (!userData) return;
    const token = getAuthToken();
    const key = String(movieId);
    const ratings = { ...userData.ratings, [key]: rating };
    updateUserData({ ratings });
    // purely local - ratings persisted to localStorage via updateUserData
  };

  return {
    userData,
    isLoading,
    updateUserData,
    toggleFavorite,
    toggleWatchlist,
    rateMovie,
  };
};
