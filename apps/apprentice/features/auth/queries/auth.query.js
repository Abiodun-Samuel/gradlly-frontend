"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AUTH_REDIRECTS, safeRedirectPath } from "@/features/auth/constants";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
} from "@/features/auth/services/auth.service";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";
import { STALE_TIMES } from "@/lib/react-query/query.config";

export function useMe(options = {}) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getMe,
    staleTime: STALE_TIMES.USER_SESSION,
    ...options,
  });
}

export function useLogin({ redirectTo } = {}) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Welcome back!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      // Honour a safe post-login redirect (e.g. returning to an invite link).
      router.replace(safeRedirectPath(redirectTo));
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "Check your inbox for a password reset link.",
      );
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "Password reset successfully. Please log in.",
      );
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toastSuccess("Signed out successfully.");
    },
    onError: () => {
      toastError("Sign out failed. Redirecting for security.");
    },
    onSettled: () => {
      qc.clear();
      router.refresh();
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    },
  });
}
