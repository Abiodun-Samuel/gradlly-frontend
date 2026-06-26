import { Users } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { CohortTable } from "@/features/cohort/components/CohortTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Cohort",
  description:
    "View and manage your learner cohort across employers and standards.",
  path: "/cohort",
  noIndex: true,
});

export default function CohortPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Users}
        eyebrow="Learners"
        title="Cohort"
        description="Unified view of active learners, OTJ progress, reviews, and delivery status."
      />
      <CohortTable />
    </div>
  );
}
