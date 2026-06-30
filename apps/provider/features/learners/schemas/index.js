import { z } from "zod";

import { INTERVENTION_ACTION_VALUES } from "../constants";

// CreateInterventionActionDto
export const interventionSchema = z.object({
  actionType: z.enum(INTERVENTION_ACTION_VALUES, {
    message: "Select an action",
  }),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const interventionDefaults = Object.freeze({
  actionType: "",
  notes: "",
});

export function toInterventionPayload(values) {
  const payload = { actionType: values.actionType };
  const notes = values.notes?.trim();
  if (notes) payload.notes = notes;
  return payload;
}
