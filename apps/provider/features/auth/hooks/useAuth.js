"use client";

import { useMemo } from "react";

import { useMe, useLogout } from "../queries/auth.query";

import { REQUIRED_ROLE } from "@/config/portals.config";

/**
 * Client-side convenience wrapper over `useMe` + `useLogout`.
 *
 * For protected server routes, use `requireAuth()` from guards/ instead —
 * it can `redirect()` synchronously without a UI flash.
 *
 * `signOut()` triggers the logout server action, which clears cookies
 * and redirects to /login from the server.
 */
export function useAuth() {
  const meQuery = useMe();
  const logoutMutation = useLogout();

  const user = meQuery.data ?? null;
  const isAuthenticated = Boolean(user);
  const isReady = !meQuery.isPending;

  const hasRequiredRole = useMemo(() => {
    if (!user) return false;
    const roles = Array.isArray(user.roles) ? user.roles : [];
    return roles.includes(REQUIRED_ROLE);
  }, [user]);

  return {
    user,
    isReady,
    isAuthenticated,
    hasRequiredRole,
    signOut: logoutMutation.mutateAsync,
    isSigningOut: logoutMutation.isPending,
    refetch: meQuery.refetch,
  };
}
