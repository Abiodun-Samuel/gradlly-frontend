"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { AI_PROGRAMME_QUERY_KEYS } from "./keys";
import { listAiProgrammeCatalogue } from "../services/ai-programmes.service";

export function useAiProgrammeCatalogue(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: AI_PROGRAMME_QUERY_KEYS.catalogue(orgId),
    queryFn: listAiProgrammeCatalogue,
    enabled: !!orgId,
    ...options,
  });
}
