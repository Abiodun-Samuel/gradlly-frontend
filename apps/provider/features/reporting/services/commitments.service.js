"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { COMMITMENT_PATHS } from "../constants";

export async function listCommitmentStatements({
  page = 1,
  perPage = 20,
} = {}) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
