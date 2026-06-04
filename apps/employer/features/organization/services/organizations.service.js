"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const ORG_PATHS = {
  CREATE: "/api/v1/organisations",
  byId: (id) => `/api/v1/organisations/${id}`,
};

export async function createOrganization(payload) {
  try {
    const result = await $apiClient.post(ORG_PATHS.CREATE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateOrganization({ orgId, payload }) {
  try {
    const result = await $apiClient.patch(ORG_PATHS.byId(orgId), payload, {
      headers: { "X-Organisation-Id": orgId },
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
