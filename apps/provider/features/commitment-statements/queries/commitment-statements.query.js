"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { COMMITMENT_QUERY_KEYS } from "./keys";
import {
  cancelCommitmentStatement,
  createCommitmentStatement,
  createCommitmentVersion,
  getCommitmentStatement,
  listCommitmentStatements,
  publishCommitmentStatement,
  signCommitmentStatement,
  updateCommitmentStatement,
} from "../services/commitment-statements.service";

export function useCommitmentStatements({
  page = 1,
  perPage = 20,
  enrolmentId,
  status,
  ...options
} = {}) {
  const { orgId } = useAuthUser();
  const params = { page, perPage, enrolmentId, status };

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.list(orgId, params),
    queryFn: () => listCommitmentStatements(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      statements: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// All versions for one enrolment (the 1:1 group). Newest first → [0] is current.
export function useEnrolmentCommitment(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.byEnrolment(orgId, enrolmentId),
    queryFn: () =>
      listCommitmentStatements({ enrolmentId, page: 1, perPage: 100 }),
    enabled: !!orgId && !!enrolmentId,
    select: (response) => {
      const versions = response?.data ?? [];
      return { versions, current: versions[0] ?? null };
    },
    ...options,
  });
}

export function useCommitmentStatement(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getCommitmentStatement(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// Shared invalidation: refresh every commitment view after any mutation.
function useInvalidateCommitments() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
}

export function useCreateCommitmentStatement() {
  const invalidate = useInvalidateCommitments();

  return useMutation({
    mutationFn: (payload) => createCommitmentStatement(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Commitment statement created.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateCommitmentStatement() {
  const invalidate = useInvalidateCommitments();

  return useMutation({
    mutationFn: ({ id, payload }) => updateCommitmentStatement({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Commitment statement updated.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useCreateCommitmentVersion() {
  const invalidate = useInvalidateCommitments();

  return useMutation({
    mutationFn: ({ groupId, payload }) =>
      createCommitmentVersion({ groupId, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "New version created.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function usePublishCommitmentStatement() {
  const invalidate = useInvalidateCommitments();

  return useMutation({
    mutationFn: (id) => publishCommitmentStatement(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Published. Generating the snapshot PDF…");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useCancelCommitmentStatement() {
  const invalidate = useInvalidateCommitments();

  return useMutation({
    mutationFn: (id) => cancelCommitmentStatement(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Commitment statement cancelled.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useSignCommitmentStatement(enrolmentId) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ id, party, signatureImageKey }) =>
      signCommitmentStatement({ id, party, signatureImageKey }),
    onSuccess: (data) => {
      const fullySigned = data?.status === "signed";
      toastSuccess(
        fullySigned
          ? "Commitment statement is now fully signed."
          : "Signature recorded.",
      );
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
      // A full signature back-fills the enrolment's participant user IDs, so
      // refresh the enrolment detail that this commitment belongs to.
      if (fullySigned && enrolmentId) {
        qc.invalidateQueries({
          queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, enrolmentId),
        });
      }
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
