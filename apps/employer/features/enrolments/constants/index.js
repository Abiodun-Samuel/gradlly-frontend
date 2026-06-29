export const ENROLMENT_PATHS = Object.freeze({
  LIST: "/api/v1/enrolments",
  detail: (id) => `/api/v1/enrolments/${id}`,
  journey: (id) => `/api/v1/enrolments/${id}/journey`,
  activate: (id) => `/api/v1/enrolments/${id}/activate`,
  cancel: (id) => `/api/v1/enrolments/${id}/cancel`,
  complete: (id) => `/api/v1/enrolments/${id}/complete`,
  participants: (id) => `/api/v1/enrolments/${id}/participants`,
});

export const ENROLMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const ENROLMENT_STATUSES = ENROLMENT_STATUS;

export const ENROLMENT_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
});

export const PIPELINE_STATE_LABELS = Object.freeze({
  invited: "Invited",
  account_created: "Account created",
  provider_accepted: "Provider accepted",
  ilr_created: "ILR created",
  das_confirmed: "DAS confirmed",
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
