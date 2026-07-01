"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { AI_PROGRAMME_QUERY_KEYS } from "./keys";
import {
  completeAiProgramme,
  createAiProgrammeEnrolment,
  getAiProgramme,
  getAiProgrammeProgress,
  listAiProgrammeCatalogue,
  updateAiProgrammeProgress,
} from "../services/ai-programmes.service";

export function useAiProgrammeCatalogue(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: AI_PROGRAMME_QUERY_KEYS.catalogue(orgId),
    queryFn: listAiProgrammeCatalogue,
    enabled: !!orgId,
    ...options,
  });
}

export function useAiProgramme(programmeId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: AI_PROGRAMME_QUERY_KEYS.programme(orgId, programmeId),
    queryFn: () => getAiProgramme(programmeId),
    enabled: !!orgId && !!programmeId,
    ...options,
  });
}

export function useAiProgrammeProgress(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: AI_PROGRAMME_QUERY_KEYS.progress(orgId, enrolmentId),
    queryFn: () => getAiProgrammeProgress(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}

export function useCreateAiProgrammeEnrolment(options = {}) {
  const queryClient = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: createAiProgrammeEnrolment,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: AI_PROGRAMME_QUERY_KEYS.catalogue(orgId),
      });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUpdateAiProgrammeProgress(enrolmentId, options = {}) {
  const queryClient = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (payload) =>
      updateAiProgrammeProgress({ enrolmentId, ...payload }),
    onSuccess: (summary) => {
      // The upsert returns the fresh progress summary; seed the cache.
      if (summary) {
        queryClient.setQueryData(
          AI_PROGRAMME_QUERY_KEYS.progress(orgId, enrolmentId),
          summary,
        );
      }
    },
    ...options,
  });
}

export function useCompleteAiProgramme(enrolmentId, options = {}) {
  const queryClient = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => completeAiProgramme(enrolmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AI_PROGRAMME_QUERY_KEYS.progress(orgId, enrolmentId),
      });
    },
    ...options,
  });
}
