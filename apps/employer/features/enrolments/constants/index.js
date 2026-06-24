export const ENROLMENT_PATHS = Object.freeze({
  LIST: "/api/v1/enrolments",
  detail: (id) => `/api/v1/enrolments/${id}`,
  journey: (id) => `/api/v1/enrolments/${id}/journey`,
  activate: (id) => `/api/v1/enrolments/${id}/activate`,
  cancel: (id) => `/api/v1/enrolments/${id}/cancel`,
  complete: (id) => `/api/v1/enrolments/${id}/complete`,
  participants: (id) => `/api/v1/enrolments/${id}/participants`,
});

export const ENROLMENT_STATUSES = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const OTJ_PACE_LEVELS = Object.freeze({
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
});

export const EPA_COUNTDOWN_BANDS = Object.freeze({
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
});
