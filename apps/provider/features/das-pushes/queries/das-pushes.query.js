"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { DAS_PUSH_QUERY_KEYS } from "./keys";
import { PIPELINES, PUSH_TERMINAL } from "../constants";
import {
  getPush,
  listFailedPushes,
  retryPush,
} from "../services/das-pushes.service";

// Resolve a pipeline key → its config (base path etc.).
function usePipeline(pipeline) {
  return PIPELINES[pipeline];
}

export function useFailedPushes(pipeline, params = {}, options = {}) {
  const { orgId } = useAuthUser();
  const config = usePipeline(pipeline);

  return useQuery({
    queryKey: DAS_PUSH_QUERY_KEYS.failed(orgId, pipeline, params),
    queryFn: () => listFailedPushes(config.base, params),
    enabled: !!orgId && !!config,
    placeholderData: keepPreviousData,
    select: (response) => ({
      pushes: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// Poll a single push until terminal (delivered/failed) — used after a retry.
export function usePush(pipeline, id, options = {}) {
  const { orgId } = useAuthUser();
  const config = usePipeline(pipeline);

  return useQuery({
    queryKey: DAS_PUSH_QUERY_KEYS.detail(orgId, pipeline, id),
    queryFn: () => getPush(config.base, id),
    enabled: !!orgId && !!config && !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && PUSH_TERMINAL.has(status) ? false : 3000;
    },
    ...options,
  });
}

export function useRetryPush(pipeline) {
  const qc = useQueryClient();
  const config = usePipeline(pipeline);

  return useMutation({
    mutationFn: (id) => retryPush(config.base, id),
    onSuccess: () => {
      toastSuccess("Retry queued.");
      // The record leaves the failed list and its detail changes — refresh both.
      qc.invalidateQueries({ queryKey: DAS_PUSH_QUERY_KEYS.all() });
    },
    onError: (error) => toastError(error.message),
  });
}
