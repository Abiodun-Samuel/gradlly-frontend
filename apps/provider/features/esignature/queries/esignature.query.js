"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import {
  createSignatureRecord,
  getSignatureRecord,
  signSignatureRecord,
} from "../services/esignature.service";

export const ESIGNATURE_QUERY_KEYS = {
  all: () => ["esignature"],
  record: (orgId, id) => ["esignature", "record", orgId, id],
};

export function useSignatureRecord(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ESIGNATURE_QUERY_KEYS.record(orgId, id),
    queryFn: () => getSignatureRecord(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useCreateSignatureRecord() {
  return useMutation({
    mutationFn: (payload) => createSignatureRecord(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Signature record created.");
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useSignSignatureRecord() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => signSignatureRecord(id),
    onSuccess: (data, id) => {
      toastSuccess("Document signed.");
      qc.invalidateQueries({
        queryKey: ESIGNATURE_QUERY_KEYS.record(orgId, id),
      });
    },
    onError: (error) => toastError(error.message),
  });
}
