"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { APPRENTICE_QUERY_KEYS } from "./keys";
import {
  createApprentice,
  deleteApprentice,
  getApprentice,
  listApprentices,
  updateApprentice,
} from "../services/apprentices.service";

export function useApprentices({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    // orgId scopes the cache so switching organisations never shows stale rows.
    // The active org itself travels on the global X-Organisation-Id header.
    queryKey: APPRENTICE_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listApprentices({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      apprentices: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// All apprentices for the active org as { value, text } options for selectors
// (e.g. the enrolment form's apprentice dropdown). The backend caps perPage at
// 100; the selector is searchable, so a single page is sufficient in practice.
export function useApprenticeOptions(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: APPRENTICE_QUERY_KEYS.options(orgId),
    queryFn: () => listApprentices({ page: 1, perPage: 100 }),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((a) => ({
        value: a.id,
        text: `${a.firstName} ${a.lastName} (${a.email})`,
      })),
    ...options,
  });
}

export function useApprentice(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: APPRENTICE_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getApprentice(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useCreateApprentice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createApprentice(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Apprentice added successfully.");
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateApprentice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateApprentice({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Apprentice updated successfully.");
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useDeleteApprentice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteApprentice(id),
    onSuccess: () => {
      toastSuccess("Apprentice deleted.");
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to delete. Please try again.");
    },
  });
}
