import { Field, Select } from "./EnrolFields";
import { T } from "./tokens";

const STANDARDS = [
  "Software Developer L4",
  "Data Technician L3",
  "Business Admin L3",
  "HR Support L3",
  "Accounting Technician L4",
  "Engineering Technician L3",
];
const PROVIDERS = [
  "Birmingham Met College",
  "Aston Training",
  "WMG Academy",
  "+ Add new provider",
];
const COHORTS = ["2024-A", "2024-B", "2024-D", "2025-A", "+ Create new cohort"];

export function EnrolStep2() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Programme details
      </p>
      <Select label="Apprenticeship standard" options={STANDARDS} />
      <Select label="Training provider" options={PROVIDERS} />
      <Field id="startDate" label="Planned start date" type="date" />
      <Select label="Cohort assignment" options={COHORTS} />
      <div
        className="rounded-xl px-4 py-3"
        style={{
          backgroundColor: T.blueLight,
          border: `1px solid ${T.blue}20`,
        }}
      >
        <p className="text-xs font-semibold" style={{ color: T.blue }}>
          Estimated funding band: £18,000 — fully levy funded
        </p>
        <p className="text-xs mt-0.5" style={{ color: T.muted }}>
          Auto-populated from selected standard
        </p>
      </div>
    </div>
  );
}
