"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OFSTED_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function getEifScores() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.EIF_SCORES);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
