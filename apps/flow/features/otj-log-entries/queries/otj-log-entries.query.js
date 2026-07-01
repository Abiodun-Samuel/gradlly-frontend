"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { STALE_TIMES } from "@/lib/react-query/query.config";

import { OTJ_QUERY_KEYS } from "./keys";
import {
  bulkApproveOtj,
  bulkRejectOtj,
  getOtjEntry,
  listOtjCategories,
  listOtjEntries,
} from "../services/otj-log-entries.service";

export function useOtjEntries(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, params),
    queryFn: () => listOtjEntries(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useOtjEntry(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getOtjEntry(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// Activity-type catalogue for the filter dropdown → { value, text } options.
// Cached longer than data: the catalogue is versioned and rarely changes.
export function useOtjCategories(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.categories(orgId),
    queryFn: listOtjCategories,
    enabled: !!orgId,
    staleTime: STALE_TIMES?.STATIC ?? 1000 * 60 * 60,
    select: (data) =>
      (data ?? []).map((c) => ({ value: c.slug, text: c.label })),
    ...options,
  });
}

// Summarises a BulkOtjActionResponseDto into a toast and refreshes the list.
function handleBulkResult(qc, result, verb) {
  const succeeded = result?.succeeded ?? 0;
  const failed = result?.failed ?? 0;

  if (failed === 0 && succeeded > 0) {
    toastSuccess(`${succeeded} ${verb}.`);
  } else if (succeeded > 0) {
    toastSuccess(`${succeeded} ${verb}, ${failed} skipped.`);
  } else {
    toastError(`Nothing ${verb} — ${failed} skipped.`);
  }

  qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
}

export function useBulkApproveOtj() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids) => bulkApproveOtj({ ids }),
    onSuccess: (result) => handleBulkResult(qc, result, "approved"),
    onError: (error) => toastError(error.message),
  });
}

export function useBulkRejectOtj() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, reason }) => bulkRejectOtj({ ids, reason }),
    onSuccess: (result) => handleBulkResult(qc, result, "rejected"),
    onError: (error) => toastError(error.message),
  });
}
