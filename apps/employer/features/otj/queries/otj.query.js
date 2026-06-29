"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { REPORTING_QUERY_KEYS } from "@/features/reporting/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { OTJ_STATUSES } from "../constants";
import { OTJ_QUERY_KEYS } from "./keys";
import {
  bulkApproveOtj,
  bulkRejectOtj,
  listOtjEntries,
} from "../services/otj.service";

export function useOtjPendingCount(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, {
      status: OTJ_STATUSES.SUBMITTED,
      page: 1,
      perPage: 1,
    }),
    queryFn: () =>
      listOtjEntries({
        orgId,
        status: OTJ_STATUSES.SUBMITTED,
        page: 1,
        perPage: 1,
      }),
    enabled: !!orgId,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    select: (response) => response?.meta?.total ?? 0,
    ...options,
  });
}

export function useOtjApprovals({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();
  const filters = { page, perPage, status: OTJ_STATUSES.SUBMITTED };

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, filters),
    queryFn: () => listOtjEntries({ ...filters, orgId }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useOtjEntries({
  status,
  apprenticeId,
  enrolmentId,
  from,
  to,
  page = 1,
  perPage = 20,
  ...options
} = {}) {
  const { orgId } = useAuthUser();
  const filters = {
    status,
    apprenticeId,
    enrolmentId,
    from,
    to,
    page,
    perPage,
  };

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, filters),
    queryFn: () => listOtjEntries({ orgId, ...filters }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

function normalizeBulkInput(input) {
  if (Array.isArray(input)) {
    return { ids: input, reason: "" };
  }
  return {
    ids: input.ids,
    reason: input.reason ?? "",
  };
}

export function useBulkApproveOtj() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (input) => {
      const { ids, reason } = normalizeBulkInput(input);
      return bulkApproveOtj({ orgId, ids, reason });
    },
    onSuccess: (data) => {
      const count = data?.succeeded ?? data?.ids?.length ?? 0;
      if (count > 0) {
        toastSuccess(`${count} ${count === 1 ? "entry" : "entries"} approved.`);
      } else {
        toastSuccess("OTJ entries approved.");
      }
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
      qc.invalidateQueries({ queryKey: REPORTING_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to approve. Please try again.");
    },
  });
}

export function useBulkRejectOtj() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ ids, reason }) => bulkRejectOtj({ orgId, ids, reason }),
    onSuccess: (data) => {
      const count = data?.succeeded ?? 0;
      toastSuccess(`${count} ${count === 1 ? "entry" : "entries"} rejected.`);
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to reject. Please try again.");
    },
  });
}
