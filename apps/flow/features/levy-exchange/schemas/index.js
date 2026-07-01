import { z } from "zod";

import {
  ELIGIBILITY_REGIONS,
  ELIGIBILITY_SECTORS,
  EMPLOYEE_COUNT_BANDS,
} from "../constants";

const values = (options) => options.map((o) => o.value);

export const levyEligibilitySchema = z.object({
  employeeCountBand: z.enum(values(EMPLOYEE_COUNT_BANDS), {
    message: "Select your employee count",
  }),
  sector: z.enum(values(ELIGIBILITY_SECTORS), {
    message: "Select your sector",
  }),
  region: z.enum(values(ELIGIBILITY_REGIONS), {
    message: "Select your region",
  }),
  hasDasAccount: z.boolean(),
});

export const levyEligibilityDefaults = {
  employeeCountBand: "10_49",
  sector: "construction",
  region: "north_west",
  hasDasAccount: false,
};
