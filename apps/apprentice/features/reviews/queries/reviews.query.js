"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REVIEW_QUERY_KEYS } from "./keys";
import { listReviews } from "../services/reviews.service";

export function useReviews({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listReviews({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      reviews: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
