export const APPRENTICE_PATHS = Object.freeze({
  LIST: "/api/v1/apprentices",
  detail: (id) => `/api/v1/apprentices/${id}`,
});

export const APPRENTICE_STATUSES = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  WITHDRAWN: "withdrawn",
});
