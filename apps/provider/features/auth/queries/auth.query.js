"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  signupAction,
  loginAction,
  logoutAction,
  meAction,
} from "../actions/auth.actions";
import { plainToAuthError } from "../errors";
import { AUTH_QUERY_KEYS } from "./keys";

/**
 * Auth query/mutation hooks.
 *
 * Note on redirects: signup/login/logout actions `redirect()` from the
 * SERVER on success. We do NOT call `router.replace` here — doing so
 * caused a redirect loop because the client-side navigation could fire
 * before the cookies were committed.
 *
 * When an action redirects, Next.js short-circuits the mutation: the
 * promise rejects with a special internal error that the framework
 * intercepts and turns into navigation. The `onSuccess` handlers below
 * therefore only fire on the no-redirect actions (i.e. `useMe`).
 *
 * If a mutation returns `{ ok: false, error }` we surface it as an
 * `AuthError` so the form can hand it to `applyServerErrors`.
 */

// ---------------------------------------------------------------------------
// useMe
// ---------------------------------------------------------------------------

export function useMe(options = {}) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      const result = await meAction();
      if (!result.ok) {
        if (result.error?.status === 401) return null;
        throw plainToAuthError(result.error);
      }
      return result.user;
    },
    staleTime: 30_000,
    retry: false,
    ...options,
  });
}

// ---------------------------------------------------------------------------
// useSignup — redirect happens on the server
// ---------------------------------------------------------------------------

export function useSignup() {
  return useMutation({
    mutationFn: async (values) => {
      const result = await signupAction(values);
      // If the action redirected, control doesn't reach here.
      // We only get a result on failure.
      if (result && !result.ok) throw plainToAuthError(result.error);
      return result;
    },
  });
}

// ---------------------------------------------------------------------------
// useLogin — redirect happens on the server
// ---------------------------------------------------------------------------

export function useLogin() {
  return useMutation({
    mutationFn: async (values) => {
      const result = await loginAction(values);
      if (result && !result.ok) throw plainToAuthError(result.error);
      return result;
    },
  });
}

// ---------------------------------------------------------------------------
// useLogout — redirect happens on the server; we just clear cache
// ---------------------------------------------------------------------------

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await logoutAction();
      if (result && !result.ok) throw plainToAuthError(result.error);
      return result;
    },
    onMutate: () => {
      // Clear cached user immediately so any client UI that reads
      // useMe doesn't flash stale data during the redirect.
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}
