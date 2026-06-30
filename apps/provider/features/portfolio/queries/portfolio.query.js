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

import { PORTFOLIO_QUERY_KEYS } from "./keys";
import { EPA_PACK_TERMINAL } from "../constants";
import {
  acceptEvidenceItem,
  createEpaPackJob,
  createKsbDefinition,
  deleteKsbDefinition,
  getEpaPackJob,
  getEvidenceItem,
  getKsbHeatmap,
  listEvidenceItems,
  listKsbDefinitions,
  returnEvidenceItem,
  reviewEvidenceItem,
  updateKsbDefinition,
  upsertKsbCoverage,
} from "../services/portfolio.service";

// ─── KSB Definitions ─────────────────────────────────────────────────────────

export function useKsbDefinitions(standardId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.ksbDefinitions(orgId, standardId),
    queryFn: () => listKsbDefinitions(standardId),
    enabled: !!orgId && !!standardId,
    select: (data) => data ?? [],
    ...options,
  });
}

export function useCreateKsbDefinition() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ standardId, payload }) =>
      createKsbDefinition({ standardId, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "KSB added.");
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateKsbDefinition() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateKsbDefinition({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "KSB updated.");
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useDeleteKsbDefinition() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteKsbDefinition(id),
    onSuccess: () => {
      toastSuccess("KSB deleted.");
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all() });
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Heatmap + coverage ──────────────────────────────────────────────────────

export function useKsbHeatmap(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.heatmap(orgId, enrolmentId),
    queryFn: () => getKsbHeatmap(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}

export function useUpsertKsbCoverage(enrolmentId) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ ksbDefinitionId, assessment }) =>
      upsertKsbCoverage({ enrolmentId, ksbDefinitionId, assessment }),
    onSuccess: () => {
      toastSuccess("Assessment saved.");
      qc.invalidateQueries({
        queryKey: PORTFOLIO_QUERY_KEYS.heatmap(orgId, enrolmentId),
      });
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Evidence items ──────────────────────────────────────────────────────────

export function useEvidenceItems(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.evidenceList(orgId, params),
    queryFn: () => listEvidenceItems(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      items: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useEvidenceItem(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.evidenceDetail(orgId, id),
    queryFn: () => getEvidenceItem(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

function useEvidenceAction(mutationFn, successMessage) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toastSuccess(data?.message || successMessage);
      // Refresh evidence views + heatmap (accept changes coverage strength).
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useReviewEvidence() {
  return useEvidenceAction(
    (id) => reviewEvidenceItem(id),
    "Marked as reviewed.",
  );
}

export function useAcceptEvidence() {
  return useEvidenceAction(
    (id) => acceptEvidenceItem(id),
    "Evidence accepted.",
  );
}

export function useReturnEvidence() {
  return useEvidenceAction(
    ({ id, reason }) => returnEvidenceItem({ id, reason }),
    "Evidence returned to the apprentice.",
  );
}

// ─── EPA pack jobs ───────────────────────────────────────────────────────────

export function useCreateEpaPackJob() {
  return useMutation({
    mutationFn: (enrolmentId) => createEpaPackJob(enrolmentId),
    onSuccess: (data) => {
      toastSuccess(data?.message || "EPA pack build started.");
    },
    onError: (error) => toastError(error.message),
  });
}

// Polls an EPA pack job until terminal (completed/failed).
export function useEpaPackJob(jobId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.epaPackJob(orgId, jobId),
    queryFn: () => getEpaPackJob(jobId),
    enabled: !!orgId && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && EPA_PACK_TERMINAL.has(status) ? false : 3000;
    },
    ...options,
  });
}
