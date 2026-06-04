import { z } from "zod";

// Title, gender and locale option sets used by the profile form.
export const TITLE_OPTIONS = [
  { value: "Mr", text: "Mr" },
  { value: "Mrs", text: "Mrs" },
  { value: "Ms", text: "Ms" },
  { value: "Miss", text: "Miss" },
  { value: "Dr", text: "Dr" },
  { value: "Prof", text: "Prof" },
];

export const GENDER_OPTIONS = [
  { value: "male", text: "Male" },
  { value: "female", text: "Female" },
  { value: "other", text: "Other" },
  { value: "prefer_not_to_say", text: "Prefer not to say" },
];

export const LOCALE_OPTIONS = [
  { value: "en-GB", text: "English (United Kingdom)" },
  { value: "en-US", text: "English (United States)" },
  { value: "en-IE", text: "English (Ireland)" },
  { value: "fr-FR", text: "French (France)" },
  { value: "es-ES", text: "Spanish (Spain)" },
  { value: "de-DE", text: "German (Germany)" },
];

const optionalString = z.string().trim().max(200).optional().or(z.literal(""));

export const profileSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  jobTitle: optionalString,
  department: optionalString,
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  locale: z.string().optional().or(z.literal("")),
  timezone: z.string().optional().or(z.literal("")),
});

// Builds form default values from the current user, normalising nulls to "".
export function profileDefaultsFromUser(user) {
  const dob = user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "";
  return {
    title: user?.title ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    dateOfBirth: dob,
    gender: user?.gender ?? "",
    jobTitle: user?.jobTitle ?? "",
    department: user?.department ?? "",
    bio: user?.bio ?? "",
    locale: user?.locale ?? "",
    timezone: user?.timezone ?? "",
  };
}

// Strips empty strings so we never overwrite stored values with blanks.
export function toProfilePayload(values) {
  const payload = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== "" && value !== null && value !== undefined) {
      payload[key] = value;
    }
  }
  return payload;
}
