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

import { STANDARD_QUERY_KEYS } from "./keys";
import {
  createStandard,
  deleteStandard,
  getStandard,
  listStandards,
  updateStandard,
} from "../services/standards.service";

export function useStandards({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    // orgId scopes the cache so switching organisations never shows stale rows.
    // The active org itself travels on the global X-Organisation-Id header.
    queryKey: STANDARD_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listStandards({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      standards: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useStandard(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getStandard(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// All standards for the active org as { value, text } options for selectors
// (e.g. the enrolment form's standard dropdown). The backend caps perPage at
// 100; the selector is searchable, so a single page is sufficient in practice.
export function useStandardOptions(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.options(orgId),
    queryFn: () => listStandards({ page: 1, perPage: 100 }),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((s) => ({
        value: s.id,
        text: `${s.title} (${s.code})`,
      })),
    ...options,
  });
}

export function useCreateStandard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createStandard(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Standard created successfully.");
      qc.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateStandard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateStandard({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Standard updated successfully.");
      qc.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useDeleteStandard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteStandard(id),
    onSuccess: () => {
      toastSuccess("Standard deleted.");
      qc.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to delete. Please try again.");
    },
  });
}
