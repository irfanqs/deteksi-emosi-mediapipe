"use client";

import { useSession } from "next-auth/react";

/**
 * Custom hook for accessing authentication state
 * Requirements: 8.1, 8.2
 * 
 * Provides easy access to the current user and authentication status
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    userId: session?.user?.id,
  };
}
