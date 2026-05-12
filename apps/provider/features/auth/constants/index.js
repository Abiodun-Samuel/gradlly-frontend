/**
 * Auth feature configuration.
 *
 * One module, one purpose: name the things. No logic here.
 */

// ---------------------------------------------------------------------------
// Upstream NestJS API paths
// ---------------------------------------------------------------------------

export const AUTH_API_PATHS = Object.freeze({
  SIGNUP: "/api/v1/auth/signup",
  LOGIN: "/api/v1/auth/login",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  ME: "/api/v1/auth/me",
});

// ---------------------------------------------------------------------------
// Same-origin BFF — the only URL the browser hits for upstream calls
// ---------------------------------------------------------------------------

export const BFF_PROXY_PREFIX = "/api/auth/proxy";

// ---------------------------------------------------------------------------
// Cookie names
// ---------------------------------------------------------------------------

export const AUTH_COOKIES = Object.freeze({
  ACCESS: "gradlly_at",
  REFRESH: "gradlly_rt",
});

// ---------------------------------------------------------------------------
// CSRF — static double-submit header on every state-changing call.
// Cross-origin attackers can't add custom headers without a CORS preflight,
// which our backend will reject.
// ---------------------------------------------------------------------------

export const CSRF_HEADER = Object.freeze({
  NAME: "x-gradlly-csrf",
  VALUE: "1",
});

// ---------------------------------------------------------------------------
// Error codes — stable contract between services and UI
// ---------------------------------------------------------------------------

export const AUTH_ERROR_CODES = Object.freeze({
  VALIDATION: "validation",
  UNAUTHORIZED: "unauthorized",
  CONFLICT: "conflict",
  FORBIDDEN: "forbidden",
  NETWORK: "network",
  SERVER: "server",
  UNKNOWN: "unknown",
});

// ---------------------------------------------------------------------------
// TanStack Query keys
// ---------------------------------------------------------------------------

export const AUTH_EVENTS = Object.freeze({
  UNAUTHORIZED: "auth:unauthorized",
});
export const PUBLIC_AUTH_PATHS = Object.freeze(["/login", "/signup"]);

// import { AUTH_API_PATHS } from '@/config/auth.config';

export const AUTH_REDIRECTS = Object.freeze({
  AFTER_LOGIN: "/",
  AFTER_LOGOUT: "/login",
  UNAUTHENTICATED: "/login",
});
