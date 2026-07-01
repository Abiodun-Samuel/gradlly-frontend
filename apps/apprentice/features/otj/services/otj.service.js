"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OTJ_PATHS, OTJ_STATUS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listOtjLogEntries({
  page = 1,
  perPage = 20,
  status,
  category,
} = {}) {
  const params = { page, perPage };
  if (status !== undefined && status !== null && status !== "")
    params.status = status;
  if (category !== undefined && category !== null && category !== "")
    params.category = category;

  try {
    const result = await $apiClient.get(OTJ_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getOtjCategories() {
  try {
    const result = await $apiClient.get(OTJ_PATHS.CATEGORIES);
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createOtjLogEntry(payload) {
  try {
    const result = await $apiClient.post(OTJ_PATHS.BASE, payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function submitOtjLogEntry(id, orgId) {
  try {
    const result = await $apiClient.patch(
      OTJ_PATHS.byId(id),
      { status: OTJ_STATUS.SUBMITTED },
      {
        headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
      },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLearnerDocuments(orgId) {
  try {
    const result = await $apiClient.get(OTJ_PATHS.LEARNER_DOCUMENTS, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** @deprecated Use createOtjLogEntry — kept for dashboard OTJ modal */
export async function createOtjLog(payload) {
  return createOtjLogEntry(payload);
}
