import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be 200 characters or fewer"),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(10, "Postcode must be 10 characters or fewer")
    .transform((v) => v.toUpperCase()),
  country: z.string().min(1, "Country is required"),
  ukprn: z.string().regex(/^\d{8}$/, "UKPRN must be exactly 8 digits"),
  orgEmail: z.string().email("Enter a valid email address"),
  orgPhone: z.string().max(20).optional().or(z.literal("")),
  website: z
    .string()
    .url("Enter a valid URL (including https://)")
    .optional()
    .or(z.literal("")),
});

export const createOrganizationDefaults = {
  name: "",
  address: "",
  city: "",
  postcode: "",
  country: "GB",
  ukprn: "",
  orgEmail: "",
  orgPhone: "",
  website: "",
};

// Update schema: same field rules, but all editable fields are independent so
// an owner can change any subset. UKPRN is immutable, so it is not editable here.
export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organisation name must be at least 2 characters")
    .max(200, "Organisation name must be 200 characters or fewer"),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(10, "Postcode must be 10 characters or fewer")
    .transform((v) => v.toUpperCase()),
  country: z.string().min(1, "Country is required").max(100),
  orgEmail: z.string().email("Enter a valid email address"),
  orgPhone: z.string().max(20).optional().or(z.literal("")),
  website: z
    .string()
    .url("Enter a valid URL (including https://)")
    .optional()
    .or(z.literal("")),
});

// Builds update-form defaults from the active organisation. Country is stored as
// a display name on the org, so it is passed through as-is for a free-text field.
export function updateOrganizationDefaultsFromOrg(org) {
  return {
    name: org?.name ?? "",
    address: org?.address ?? "",
    city: org?.city ?? "",
    postcode: org?.postcode ?? "",
    country: org?.country ?? "",
    orgEmail: org?.orgEmail ?? "",
    orgPhone: org?.orgPhone ?? "",
    website: org?.website ?? "",
  };
}
