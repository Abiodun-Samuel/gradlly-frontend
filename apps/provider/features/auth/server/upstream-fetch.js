import "server-only";
import { serverEnv } from "@/config/env/server";

/**
 * Thin server-only fetch wrapper around the upstream NestJS API.
 *
 * Single responsibility: take a path, method, and body; return parsed
 * JSON or throw an error shaped like the browser-side `ApiError` so the
 * downstream `normalizeAuthError` can read it uniformly.
 *
 * No cookies are read or written here; that is the session-cookies
 * module's job.
 */

export class UpstreamError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "UpstreamError";
    this.status = status;
    this.data = data;
  }
}

export async function upstreamFetch(
  path,
  { method = "GET", body, accessToken, headers } = {},
) {
  const url = new URL(path, serverEnv.API_BASE_URL).toString();

  const reqHeaders = { Accept: "application/json", ...headers };
  if (body !== undefined) reqHeaders["Content-Type"] = "application/json";
  if (accessToken) reqHeaders.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") ?? "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    throw new UpstreamError(
      (data && (data.message || data.error)) ||
        `Upstream request failed with status ${res.status}`,
      res.status,
      data,
    );
  }

  return data;
}

/** Backend wraps successes as `{ message, data }`. Unwrap defensively. */
export function unwrap(payload) {
  return payload?.data ?? payload ?? {};
}
