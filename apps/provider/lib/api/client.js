import { CSRF_HEADER, BFF_PROXY_PREFIX } from "@/features/auth/constants";

/**
 * Browser HTTP client.
 *
 * Token posture: zero tokens in JavaScript. Cookies are httpOnly and
 * set server-side. All upstream calls go through the same-origin BFF at
 * `BFF_PROXY_PREFIX`, which attaches `Authorization` server-side.
 *
 * URL convention: pass a path that begins with `/api/v1/...` (an
 * upstream path) and this client routes it through the BFF. Anything
 * else is hit verbatim on the same origin.
 */

export class ApiError extends Error {
  constructor(message, status, data, headers) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.headers = headers;
  }
}

function isUpstreamPath(path) {
  return path.startsWith("/api/v1/");
}

function buildURL(path, params) {
  const target = isUpstreamPath(path) ? `${BFF_PROXY_PREFIX}${path}` : path;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(target, origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function serializeBody(body) {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;
  try {
    return JSON.stringify(body);
  } catch (err) {
    throw new ApiError(
      "Cannot serialize request body to JSON.",
      0,
      { reason: "body-serialization", original: err?.message },
      new Headers(),
    );
  }
}

function buildHeaders({ isFormData, hasBody, custom }) {
  const headers = {
    Accept: "application/json",
    [CSRF_HEADER.NAME]: CSRF_HEADER.VALUE,
    ...custom,
  };
  if (!isFormData && hasBody) headers["Content-Type"] = "application/json";
  return headers;
}

async function request(method, path, options = {}) {
  const {
    params,
    timeout = 15000,
    body,
    headers: customHeaders,
    ...rest
  } = options;

  const url = buildURL(path, params);
  const isFormData = body instanceof FormData;
  const serialized = serializeBody(body);
  const headers = buildHeaders({
    isFormData,
    hasBody: body !== undefined,
    custom: customHeaders,
  });

  const controller = new AbortController();
  const timeoutId =
    timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: serialized,
      credentials: "same-origin",
      signal: controller.signal,
      ...rest,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408, null, new Headers());
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
      null,
      new Headers(),
    );
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new ApiError(
      (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`,
      response.status,
      data,
      response.headers,
    );
  }

  return { data, status: response.status, headers: response.headers };
}

const $api = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};

export default $api;
