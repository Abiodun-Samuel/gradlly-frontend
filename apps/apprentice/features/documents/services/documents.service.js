"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { DOCUMENT_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listMyDocuments({ enrolmentId, orgId } = {}) {
  try {
    const result = await $apiClient.get(DOCUMENT_PATHS.MY_DOCUMENTS, {
      params: enrolmentId ? { enrolmentId } : undefined,
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
