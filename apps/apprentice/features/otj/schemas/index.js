import { z } from "zod";

export const otjLogSchema = z.object({
  activityName: z.string().trim().min(1, "Please describe what you did"),
  category: z.string().min(1, "Please select a category"),
  loggedDate: z.string().min(1, "Please select a date"),
  hours: z
    .string()
    .min(1, "Please enter hours")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Must be greater than 0",
    })
    .refine((v) => Number(v) <= 24, {
      message: "Cannot exceed 24 hours",
    }),
});

export const otjLogDefaults = Object.freeze({
  activityName: "",
  category: "",
  loggedDate: "",
  hours: "",
});
