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

import { OTJ_STATUS } from "../constants";
import { OTJ_QUERY_KEYS } from "./keys";
import {
  bulkApproveOtjEntries,
  listOtjLogEntries,
} from "../services/otj.service";

export function useOtjApprovals({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();
  const filters = { page, perPage, status: OTJ_STATUS.SUBMITTED };

  return useQuery({
    queryKey: OTJ_QUERY_KEYS.list(orgId, filters),
    queryFn: () => listOtjLogEntries({ ...filters, orgId }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useBulkApproveOtj() {
  const { orgId } = useAuthUser();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids) => bulkApproveOtjEntries(ids, orgId),
    onSuccess: () => {
      toastSuccess("OTJ entries approved.");
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.all() });
      qc.invalidateQueries({ queryKey: REPORTING_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to approve entries.");
    },
  });
}
