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

import { PROGRAMME_QUERY_KEYS } from "./keys";
import {
  createProgramme,
  deleteProgramme,
  listProgrammes,
  updateProgramme,
} from "../services/programmes.service";

export function useProgrammes({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    // orgId scopes the cache so switching organisations never shows stale rows.
    // The active org itself travels on the global X-Organisation-Id header.
    queryKey: PROGRAMME_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listProgrammes({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      programmes: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// All programmes for the active org as { value, text } options for selectors
// (e.g. the standard form's programme dropdown). The backend caps perPage at
// 100; orgs with more programmes than that are exceedingly rare, and the
// selector is searchable, so a single page is sufficient in practice.
export function useProgrammeOptions(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PROGRAMME_QUERY_KEYS.options(orgId),
    queryFn: () => listProgrammes({ page: 1, perPage: 100 }),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((p) => ({
        value: p.id,
        text: `${p.title} (${p.code})`,
      })),
    ...options,
  });
}

export function useCreateProgramme() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createProgramme(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Programme created successfully.");
      qc.invalidateQueries({ queryKey: PROGRAMME_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateProgramme() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateProgramme({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Programme updated successfully.");
      qc.invalidateQueries({ queryKey: PROGRAMME_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useDeleteProgramme() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProgramme(id),
    onSuccess: () => {
      toastSuccess("Programme deleted.");
      qc.invalidateQueries({ queryKey: PROGRAMME_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to delete. Please try again.");
    },
  });
}
