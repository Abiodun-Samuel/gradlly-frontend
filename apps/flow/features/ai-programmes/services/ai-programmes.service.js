"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { AI_PROGRAMME_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listAiProgrammeCatalogue() {
  try {
    const result = await $apiClient.get(AI_PROGRAMME_PATHS.CATALOGUE);
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
