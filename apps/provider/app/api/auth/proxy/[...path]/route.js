import "server-only";
import { NextResponse } from "next/server";

import { serverEnv } from "@/config/env.server";
import { AUTH_API_PATHS, CSRF_HEADER } from "@/features/auth/config";
import { readAccessToken } from "@/features/auth/lib/session-cookies";
import * as authService from "@/features/auth/services/auth.service";

/**
 * Same-origin BFF for authenticated browser → backend calls.
 *
 * Why a BFF?
 * ----------
 * Tokens live in httpOnly cookies — client JS can't read them. The
 * browser still needs to call protected upstream endpoints. This handler
 * sits on the same origin (so cookies flow automatically), reads the
 * access token server-side, attaches `Authorization: Bearer`, and
 * forwards the call. On 401 it calls `refresh()` once and retries.
 *
 * The browser never sees a token. The upstream never sees a cookie.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Auth flows go through Server Actions; never proxy them.
const FORBIDDEN = new Set([
  AUTH_API_PATHS.LOGIN,
  AUTH_API_PATHS.SIGNUP,
  AUTH_API_PATHS.REFRESH,
  AUTH_API_PATHS.LOGOUT,
]);

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FORWARDABLE_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "x-request-id",
];

function buildUpstreamUrl(segments, search) {
  const url = new URL("/" + segments.join("/"), serverEnv.API_BASE_URL);
  if (search) url.search = search;
  return url.toString();
}

function copyHeaders(incoming) {
  const out = new Headers();
  for (const name of FORWARDABLE_HEADERS) {
    const v = incoming.get(name);
    if (v) out.set(name, v);
  }
  return out;
}

async function forward({ url, method, headers, body, accessToken }) {
  const fwd = new Headers(headers);
  if (accessToken) fwd.set("Authorization", `Bearer ${accessToken}`);
  return fetch(url, {
    method,
    headers: fwd,
    body: method === "GET" || method === "HEAD" ? undefined : body,
    cache: "no-store",
    duplex: "half",
  });
}

function jsonError(message, status) {
  return NextResponse.json({ message, statusCode: status }, { status });
}

async function handle(req, context) {
  const { path: segments = [] } = await context.params;
  const upstreamPath = "/" + segments.join("/");

  if (FORBIDDEN.has(upstreamPath)) {
    return jsonError("This endpoint is not proxied", 404);
  }
  if (
    MUTATING.has(req.method) &&
    req.headers.get(CSRF_HEADER.NAME) !== CSRF_HEADER.VALUE
  ) {
    return jsonError("CSRF check failed", 403);
  }

  const url = buildUpstreamUrl(segments, new URL(req.url).search);
  const headers = copyHeaders(req.headers);
  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : req.body;

  const accessToken = await readAccessToken();
  let upstream = await forward({
    url,
    method: req.method,
    headers,
    body,
    accessToken,
  });

  if (upstream.status === 401) {
    const rotated = await authService.refresh();
    if (rotated) {
      upstream = await forward({
        url,
        method: req.method,
        headers,
        body, // browser bodies are consumed once; for retry to work, callers should send JSON (text body) — Next deserializes it cleanly
        accessToken: rotated.accessToken,
      });
    }
  }

  // Stream the upstream response through unchanged.
  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("Content-Type", contentType);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
