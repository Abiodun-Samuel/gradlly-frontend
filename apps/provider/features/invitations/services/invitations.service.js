"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import {
  APPRENTICE_PORTAL_TYPE,
  APPRENTICE_ROLE,
  INVITATION_PATHS,
  INVITATION_ROLES,
} from "../constants";

function resolveInviteRole(uiRole) {
  if (uiRole === APPRENTICE_ROLE) {
    return {
      role: INVITATION_ROLES.MEMBER,
      portalOverride: APPRENTICE_PORTAL_TYPE,
    };
  }
  return { role: uiRole, portalOverride: null };
}

function buildHeaders(orgId, portalOverride) {
  const headers = { "X-Organisation-Id": orgId };
  if (portalOverride) headers["x-portal-type-override"] = portalOverride;
  return headers;
}

export async function sendInvitation({ orgId, email, role }) {
  const { role: payloadRole, portalOverride } = resolveInviteRole(role);
  try {
    const result = await $apiClient.post(
      INVITATION_PATHS.BASE,
      { email, role: payloadRole },
      { headers: buildHeaders(orgId, portalOverride) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listInvitations({ orgId, page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(INVITATION_PATHS.BASE, {
      headers: buildHeaders(orgId),
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function resendInvitation({ orgId, id, portalOverride = null }) {
  try {
    const result = await $apiClient.post(
      INVITATION_PATHS.resend(id),
      {},
      { headers: buildHeaders(orgId, portalOverride) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function revokeInvitation({ orgId, id }) {
  try {
    await $apiClient.delete(INVITATION_PATHS.revoke(id), {
      headers: buildHeaders(orgId),
    });
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function acceptInvitation({ token }) {
  try {
    const result = await $apiClient.post(INVITATION_PATHS.ACCEPT, { token });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
