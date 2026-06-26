"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OTJ_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listOtjLogEntries({
  page = 1,
  perPage = 20,
  status,
  orgId,
} = {}) {
  const params = { page, perPage };
  if (status !== undefined && status !== null && status !== "")
    params.status = status;

  try {
    const result = await $apiClient.get(OTJ_PATHS.BASE, {
      params,
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function bulkApproveOtjEntries(ids, orgId) {
  try {
    const result = await $apiClient.post(
      OTJ_PATHS.BULK_APPROVE,
      { ids },
      {
        headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
      },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
