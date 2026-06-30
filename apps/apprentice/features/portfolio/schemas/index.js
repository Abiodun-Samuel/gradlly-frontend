import { z } from "zod";

export const ksbEvidenceSchema = z
  .object({
    type: z.enum(["file", "link", "text"]),
    title: z.string().trim().min(1, "Title is required"),
    url: z.string().optional(),
    text: z.string().optional(),
    notes: z.string().optional(),
    ksbDefinitionIds: z.array(z.string()).min(1, "Select at least one KSB"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "link" && !data.url?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL is required for link entries",
        path: ["url"],
      });
    }
    if (data.type === "text" && !data.text?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Entry text is required",
        path: ["text"],
      });
    }
  });

export const ksbEvidenceDefaults = Object.freeze({
  type: "file",
  title: "",
  url: "",
  text: "",
  notes: "",
  ksbDefinitionIds: [],
});
