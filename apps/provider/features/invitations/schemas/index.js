import { z } from "zod";

import { APPRENTICE_ROLE, INVITATION_ROLES } from "../constants";

export const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(
    [
      INVITATION_ROLES.OWNER,
      INVITATION_ROLES.ADMIN,
      INVITATION_ROLES.MEMBER,
      APPRENTICE_ROLE,
    ],
    { errorMap: () => ({ message: "Select a valid role" }) },
  ),
});

export const inviteDefaults = Object.freeze({
  email: "",
  role: INVITATION_ROLES.MEMBER,
});
