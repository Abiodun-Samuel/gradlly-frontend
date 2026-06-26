"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REPORTING_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

function unwrapProviderDashboardSummary(result) {
  const payload = unwrap(result);
  if (!payload || typeof payload !== "object") return null;
  if (payload.summary && typeof payload.summary === "object") {
    return payload.summary;
  }
  // Tolerate a flat summary payload if the envelope shape changes.
  if ("cohortCount" in payload) return payload;
  return null;
}

export async function getProviderDashboard(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.PROVIDER_DASHBOARD, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrapProviderDashboardSummary(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listEmployerDirectory({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.EMPLOYER_DIRECTORY, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
