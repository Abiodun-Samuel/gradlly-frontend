export const AUTH_API_PATHS = Object.freeze({
  LOGIN: "/api/v1/auth/login",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  ME: "/api/v1/auth/me",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
  ACCEPT_INVITATION: "/api/v1/invitations/accept",
});

export const AUTH_COOKIES = Object.freeze({
  ACCESS: "gradlly_at",
  REFRESH: "gradlly_rt",
});

export const AUTH_REDIRECTS = Object.freeze({
  DASHBOARD_HOME_PAGE: "/",
  LOGIN_PAGE: "/login",
});

/**
 * Validates a post-login redirect target. Only same-origin absolute paths are
 * allowed (must start with a single "/"), preventing open-redirect attacks.
 */
export function safeRedirectPath(
  path,
  fallback = AUTH_REDIRECTS.DASHBOARD_HOME_PAGE,
) {
  if (typeof path !== "string") return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
