"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { PDF_JOB_TERMINAL, getPdfJob } from "../services/pdf.service";

export const PDF_QUERY_KEYS = {
  job: (orgId, id) => ["pdf", "job", orgId, id],
};

/**
 * Polls a PDF job until it reaches a terminal state (completed/failed).
 * Polling stops automatically once terminal, so it's safe to mount on a page.
 *
 * @param {string} jobId
 * @param {object} [options]  passed through to useQuery (e.g. enabled)
 */
export function usePdfJob(jobId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PDF_QUERY_KEYS.job(orgId, jobId),
    queryFn: () => getPdfJob(jobId),
    enabled: !!orgId && !!jobId,
    // Poll every 3s while queued/processing; stop once terminal.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && PDF_JOB_TERMINAL.has(status) ? false : 3000;
    },
    ...options,
  });
}
