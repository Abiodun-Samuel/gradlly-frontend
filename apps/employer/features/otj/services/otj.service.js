"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OTJ_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function listOtjEntries({
  orgId,
  status,
  apprenticeId,
  enrolmentId,
  from,
  to,
  page = 1,
  perPage = 20,
} = {}) {
  const params = { page, perPage };
  if (status) params.status = status;
  if (apprenticeId) params.apprenticeId = apprenticeId;
  if (enrolmentId) params.enrolmentId = enrolmentId;
  if (from) params.from = from;
  if (to) params.to = to;

  try {
    const result = await $apiClient.get(OTJ_PATHS.BASE, {
      headers: buildHeaders(orgId),
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function bulkApproveOtj({ orgId, ids, reason = "" }) {
  try {
    const result = await $apiClient.post(
      OTJ_PATHS.bulkApprove(),
      { ids, reason },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function bulkRejectOtj({ orgId, ids, reason }) {
  try {
    const result = await $apiClient.post(
      OTJ_PATHS.bulkReject(),
      { ids, reason },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateOtjEntry({ orgId, id, ...body }) {
  try {
    const result = await $apiClient.patch(OTJ_PATHS.detail(id), body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteOtjEntry({ orgId, id }) {
  try {
    await $apiClient.delete(OTJ_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
