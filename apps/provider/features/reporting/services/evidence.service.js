"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { EVIDENCE_PATHS } from "../constants";

export async function listEvidenceItems({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(EVIDENCE_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
