export const LEVY_PATHS = Object.freeze({
  SURPLUS: "/api/v1/levy-exchange/surplus",
  SURPLUS_RECOMPUTE: "/api/v1/levy-exchange/surplus/recompute",
  EXPIRY_CALENDAR: "/api/v1/levy-exchange/surplus/expiry-calendar",
  DONOR_LINKS: "/api/v1/levy-exchange/donor-links",
  donorLink: (id) => `/api/v1/levy-exchange/donor-links/${id}`,
  donorSync: (id) => `/api/v1/levy-exchange/donor-links/${id}/sync`,
  TRANSFER_PREFERENCES: "/api/v1/levy-exchange/transfer-preferences",
  MATCH_APPLICATIONS: "/api/v1/levy-exchange/match-applications",
  matchApplication: (id) => `/api/v1/levy-exchange/match-applications/${id}`,
  TRANSFERS: "/api/v1/levy-exchange/transfers",
  transfer: (id) => `/api/v1/levy-exchange/transfers/${id}`,
});

export const DONOR_LINK_STATUSES = Object.freeze({
  PENDING_CONSENT: "pending_consent",
  ACTIVE: "active",
  ERROR: "error",
  REVOKED: "revoked",
});

export const MATCH_APPLICATION_STATUSES = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
});
