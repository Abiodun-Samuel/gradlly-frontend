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

import { OTJ_QUERY_KEYS } from "./keys";
import {
  createOtjLog,
  createOtjLogEntry,
  getLearnerDocuments,
  getOtjCategories,
  listOtjLogEntries,
  submitOtjLogEntry,
} from "../services/otj.service";

export function useLearnerDocuments(options = {}) {
  const { orgId, isLoading: authLoading } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.learnerDocuments(orgId),
    queryFn: () => getLearnerDocuments(orgId),
    enabled: !!orgId && !authLoading,
    ...options,
  });
}

export function useCreateOtjLog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createOtjLog,
    onSuccess: () => {
      toastSuccess("Session logged successfully.");
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.logs() });
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useOtjLogEntries({
  page = 1,
  perPage = 20,
  status,
  category,
  ...options
} = {}) {
  const { orgId } = useAuthUser();
  const filters = { page, perPage, status, category };

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, filters),
    queryFn: () => listOtjLogEntries(filters),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useOtjCategories(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.categories(orgId),
    queryFn: () => getOtjCategories(),
    enabled: !!orgId,
    select: (data) =>
      (data ?? []).map((c) => ({
        value: c.slug,
        text: c.label,
      })),
    ...options,
  });
}

export function useCreateOtjLogEntry() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createOtjLogEntry(payload),
    onSuccess: () => {
      toastSuccess("OTJ entry logged successfully.");
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useSubmitOtjLogEntry() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => submitOtjLogEntry(id, orgId),
    onSuccess: () => {
      toastSuccess("OTJ entry submitted for approval.");
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
