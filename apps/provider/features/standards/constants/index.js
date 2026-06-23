export const STANDARD_PATHS = Object.freeze({
  BASE: "/api/v1/standards",
  byId: (id) => `/api/v1/standards/${id}`,
});

// Backend-recognised standard statuses (`StandardStatus`).
export const STANDARD_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
});

export const STANDARD_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  active: "Active",
  archived: "Archived",
});

// Options for the status <select> in the create/edit form, in lifecycle order.
export const STANDARD_STATUS_OPTIONS = [
  { value: STANDARD_STATUS.DRAFT, text: "Draft" },
  { value: STANDARD_STATUS.ACTIVE, text: "Active" },
  { value: STANDARD_STATUS.ARCHIVED, text: "Archived" },
];

export const STANDARD_STATUS_VALUES = Object.values(STANDARD_STATUS);
