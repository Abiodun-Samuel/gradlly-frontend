"use client";

import { useMutation } from "@tanstack/react-query";

import { checkLevyEligibility } from "../services/levy-exchange.service";

// Public eligibility self-assessment. No cache/invalidation — it's an anonymous,
// stateless POST whose result the UI holds locally.
export function useCheckLevyEligibility(options = {}) {
  return useMutation({
    mutationFn: checkLevyEligibility,
    ...options,
  });
}
