import { ApiClientError } from "@/lib/errors";

import { getActiveOrgId } from "./active-org";
import { parseFetchResponse } from "./parse-response";

const BFF = "/api/proxy";

async function send(path, method, body, opts = {}) {
  const { signal, params, headers: extraHeaders, public: isPublic } = opts;

  let url = `${BFF}${path}`;
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    url += (path.includes("?") ? "&" : "?") + qs;
  }

  const headers = new Headers({
    Accept: "application/json",
    "x-gradlly-csrf": "1",
  });
  if (body !== undefined) headers.set("Content-Type", "application/json");

  // Always include the active organisation (when authenticated), mirroring how
  // X-Portal-Type is always sent. An explicit per-call header still wins.
  // Public (pre-account) endpoints — e.g. the Levy eligibility check and the
  // registration wizard — are org-less by design: never attach the org id, so a
  // logged-in user browsing the funnel can't leak their tenant scope upstream.
  if (!isPublic) {
    const activeOrgId = getActiveOrgId();
    if (activeOrgId) headers.set("X-Organisation-Id", activeOrgId);
  }

  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (value !== null && value !== undefined) headers.set(key, value);
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    signal,
  });

  return parseFetchResponse(response, {
    throwError: ({ message, status, data }) => {
      throw new ApiClientError({ message, status, data });
    },
  });
}

export const $apiClient = {
  get: (path, opts) => send(path, "GET", undefined, opts),
  post: (path, body, opts) => send(path, "POST", body, opts),
  put: (path, body, opts) => send(path, "PUT", body, opts),
  patch: (path, body, opts) => send(path, "PATCH", body, opts),
  delete: (path, opts) => send(path, "DELETE", undefined, opts),
};

// Org-less client for public, pre-account endpoints (Levy eligibility check,
// registration wizard). Same BFF + CSRF handling, but never sends the active
// org id. Sessions still ride along via cookies if present, which is harmless.
export const $publicApiClient = {
  get: (path, opts) => send(path, "GET", undefined, { ...opts, public: true }),
  post: (path, body, opts) =>
    send(path, "POST", body, { ...opts, public: true }),
  put: (path, body, opts) => send(path, "PUT", body, { ...opts, public: true }),
};
