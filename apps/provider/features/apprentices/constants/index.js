export const APPRENTICE_PATHS = Object.freeze({
  BASE: "/api/v1/apprentices",
  byId: (id) => `/api/v1/apprentices/${id}`,
});

// Backend-recognised apprentice statuses (`ApprenticeStatus`).
export const APPRENTICE_STATUS = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  WITHDRAWN: "withdrawn",
});

export const APPRENTICE_STATUS_LABELS = Object.freeze({
  pending: "Pending",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  withdrawn: "Withdrawn",
});

// Options for the status <select> in the create/edit form, in lifecycle order.
export const APPRENTICE_STATUS_OPTIONS = [
  { value: APPRENTICE_STATUS.PENDING, text: "Pending" },
  { value: APPRENTICE_STATUS.ACTIVE, text: "Active" },
  { value: APPRENTICE_STATUS.PAUSED, text: "Paused" },
  { value: APPRENTICE_STATUS.COMPLETED, text: "Completed" },
  { value: APPRENTICE_STATUS.WITHDRAWN, text: "Withdrawn" },
];

export const APPRENTICE_STATUS_VALUES = Object.values(APPRENTICE_STATUS);
