"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PORTFOLIO_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function getKsbHeatmap(enrolmentId) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.KSB_HEATMAP, {
      params: { enrolmentId },
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
