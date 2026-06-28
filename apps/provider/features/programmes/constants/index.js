export const PROGRAMME_PATHS = Object.freeze({
  BASE: "/api/v1/programmes",
  byId: (id) => `/api/v1/programmes/${id}`,
});

// Backend-recognised programme statuses (`ProgrammeStatus`).
export const PROGRAMME_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
});

export const PROGRAMME_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  active: "Active",
  archived: "Archived",
});

// Options for the status <select> in the create/edit form, in lifecycle order.
export const PROGRAMME_STATUS_OPTIONS = [
  { value: PROGRAMME_STATUS.DRAFT, text: "Draft" },
  { value: PROGRAMME_STATUS.ACTIVE, text: "Active" },
  { value: PROGRAMME_STATUS.ARCHIVED, text: "Archived" },
];

export const PROGRAMME_STATUS_VALUES = Object.values(PROGRAMME_STATUS);
