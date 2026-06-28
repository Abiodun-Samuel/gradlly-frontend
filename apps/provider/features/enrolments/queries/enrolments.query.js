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

import { ENROLMENT_QUERY_KEYS } from "./keys";
import {
  acceptProviderEnrolment,
  activateEnrolment,
  cancelEnrolment,
  completeEnrolment,
  createEnrolment,
  getEnrolment,
  getEnrolmentJourney,
  listEnrolments,
  recordEpaOutcome,
  setEnrolmentJourney,
  setEnrolmentOrganisationLinks,
  setEnrolmentParticipants,
} from "../services/enrolments.service";

// ─── Reads ────────────────────────────────────────────────────────────────────

export function useEnrolments({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listEnrolments({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      enrolments: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useEnrolment(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getEnrolment(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useEnrolmentJourney(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.journey(orgId, id),
    queryFn: () => getEnrolmentJourney(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// ─── Shared cache helpers ────────────────────────────────────────────────────

// Any enrolment mutation can change the list, the detail, and the journey
// (gateway/pipeline are derived). Invalidating the whole namespace keeps every
// surface consistent without threading the orgId/id through each call site.
function useInvalidateEnrolments() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.all() });
}

// Standard onError: surface non-validation errors as a toast (forms render
// field errors themselves via applyServerErrors).
function toastUnlessValidation(error) {
  if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function useCreateEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (payload) => createEnrolment(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment created.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

// ─── Sub-resource PATCH endpoints ────────────────────────────────────────────

export function useSetEnrolmentJourney() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => setEnrolmentJourney({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "EPA date updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

export function useSetEnrolmentParticipants() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => setEnrolmentParticipants({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Participants updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

export function useSetEnrolmentOrganisationLinks() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      setEnrolmentOrganisationLinks({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Organisation links updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

// ─── Lifecycle actions ───────────────────────────────────────────────────────

export function useActivateEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => activateEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment activated.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useAcceptProviderEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => acceptProviderEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Provider acceptance recorded.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useCompleteEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => completeEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment completed.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useCancelEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => cancelEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment cancelled.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useRecordEpaOutcome() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => recordEpaOutcome({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "EPA outcome recorded.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}
