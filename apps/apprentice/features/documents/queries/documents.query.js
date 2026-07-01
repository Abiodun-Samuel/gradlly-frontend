"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { DOCUMENT_QUERY_KEYS } from "./keys";
import { listMyDocuments } from "../services/documents.service";

export function useMyDocuments({ enrolmentId, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DOCUMENT_QUERY_KEYS.myDocuments(orgId, enrolmentId),
    queryFn: () => listMyDocuments({ enrolmentId, orgId }),
    enabled: !!orgId,
    select: (data) => data?.enrolments ?? [],
    ...options,
  });
}
