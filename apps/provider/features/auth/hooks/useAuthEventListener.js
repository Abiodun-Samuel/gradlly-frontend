"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AUTH_EVENTS, AUTH_REDIRECTS, PUBLIC_AUTH_PATHS } from "../constants";
import { AUTH_QUERY_KEYS } from "../queries/keys";

/**
 * Subscribes to `auth:unauthorized` dispatched by the API client whenever a
 * 401 is received. Clears auth cache and redirects to /login (unless already
 * on a public auth page).
 *
 * Mount ONCE near the top of the tree (Providers).
 */
export function useAuthEventListener() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    function onUnauthorized() {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all() });
      queryClient.clear();
      if (!PUBLIC_AUTH_PATHS.includes(pathname)) {
        router.replace(AUTH_REDIRECTS.UNAUTHENTICATED);
      }
    }

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
    };
  }, [router, pathname, queryClient]);
}
