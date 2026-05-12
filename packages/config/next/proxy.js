import { NextResponse } from "next/server";

// ─── Route tables ──────────────────────────────────────────────────────────

const SHARED_PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/auth/error",
  "/api/health",
]);

const SHARED_PUBLIC_PREFIXES = ["/reset-password/", "/auth/", "/invite/"];

const STATIC_PREFIXES = [
  "/_next/",
  "/favicon",
  "/icons/",
  "/images/",
  "/fonts/",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
];

// ─── Cookie names ──────────────────────────────────────────────────────────

const SESSION_COOKIE = "gradlly_session";
const SESSION_COOKIE_SEC = "__Secure-gradlly_session";

// ─── JWT decode ────────────────────────────────────────────────────────────

function decodeJwtPayload(token) {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.sub !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.orgId !== "string" ||
      typeof parsed.portalId !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getSessionToken(req) {
  return (
    req.cookies.get(SESSION_COOKIE_SEC)?.value ??
    req.cookies.get(SESSION_COOKIE)?.value
  );
}

function isStaticAsset(pathname) {
  return STATIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isPublicRoute(pathname, extraRoutes) {
  if (SHARED_PUBLIC_ROUTES.has(pathname)) return true;
  if (SHARED_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (extraRoutes.some((r) => pathname === r || pathname.startsWith(r)))
    return true;
  return false;
}

function isTokenExpired(payload) {
  return Math.floor(Date.now() / 1000) > payload.exp - 30;
}

function redirectToLogin(req) {
  const loginUrl = new URL("/login", req.nextUrl.origin);
  loginUrl.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );

  const res = NextResponse.redirect(loginUrl);

  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(SESSION_COOKIE_SEC);

  return res;
}

// ─── Security headers ──────────────────────────────────────────────────────

function applySecurityHeaders(res, portalId) {
  const isProd = process.env.NODE_ENV === "production";

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.gradlly.com https://*.account.gov.uk",
    "connect-src 'self' https://api.gradlly.com https://*.gradlly.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://oidc.account.gov.uk",
    isProd ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Portal-Id", portalId);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return res;
}

// ─── Rate limiter ──────────────────────────────────────────────────────────

const RL_MAP = new Map();
const RL_WINDOW = 60_000;
const RL_MAX = 20;

function isRateLimited(ip, pathname) {
  if (pathname !== "/login" && !pathname.startsWith("/auth/")) return false;

  const now = Date.now();
  const entry = RL_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RL_MAP.set(ip, { count: 1, resetAt: now + RL_WINDOW });
    return false;
  }

  entry.count += 1;
  return entry.count > RL_MAX;
}

// ─── Factory ───────────────────────────────────────────────────────────────

export function createProxy(options) {
  const { portalId, extraPublicRoutes = [], allowedRoles = [] } = options;

  return async function proxy(req) {
    const { pathname } = req.nextUrl;

    if (isStaticAsset(pathname)) return NextResponse.next();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip, pathname)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }

    if (isPublicRoute(pathname, extraPublicRoutes)) {
      return applySecurityHeaders(NextResponse.next(), portalId);
    }

    const token = getSessionToken(req);

    if (!token) return redirectToLogin(req);

    const payload = decodeJwtPayload(token);

    if (!payload) return redirectToLogin(req);

    if (isTokenExpired(payload)) return redirectToLogin(req);

    if (payload.portalId !== portalId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const forwardedHeaders = new Headers(req.headers);
    forwardedHeaders.set("x-user-id", payload.sub);
    forwardedHeaders.set("x-user-role", payload.role);
    forwardedHeaders.set("x-org-id", payload.orgId);
    forwardedHeaders.set("x-portal-id", portalId);

    const res = NextResponse.next({
      request: { headers: forwardedHeaders },
    });

    return applySecurityHeaders(res, portalId);
  };
}
