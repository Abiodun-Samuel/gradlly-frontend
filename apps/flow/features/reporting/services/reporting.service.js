"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REPORTING_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function getSmeOverview(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.SME_OVERVIEW, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
