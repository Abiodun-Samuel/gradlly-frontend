/**
 * Portal configuration.
 *
 * Each app sets `NEXT_PUBLIC_PORTAL` in its environment. From that we
 * derive the required role and a map of inter-portal URLs.
 */

import { clientEnv } from "./env/client";

export const PORTAL = Object.freeze({
  EMPLOYER: "employer",
  PROVIDER: "provider",
  APPRENTICE: "apprentice",
  FLOW: "flow",
});

export const ROLE = PORTAL; // 1:1 today — kept as a separate name for intent

export const CURRENT_PORTAL = clientEnv.NEXT_PUBLIC_PORTAL;
export const REQUIRED_ROLE = CURRENT_PORTAL;

const PORTAL_URLS = Object.freeze({
  [PORTAL.EMPLOYER]: clientEnv.NEXT_PUBLIC_EMPLOYER_URL,
  [PORTAL.PROVIDER]: clientEnv.NEXT_PUBLIC_PROVIDER_URL,
  [PORTAL.APPRENTICE]: clientEnv.NEXT_PUBLIC_APPRENTICE_URL,
  [PORTAL.FLOW]: clientEnv.NEXT_PUBLIC_FLOW_URL,
});

export function getPortalUrlForRole(role) {
  return PORTAL_URLS[role] ?? clientEnv.NEXT_PUBLIC_MAIN_URL;
}
