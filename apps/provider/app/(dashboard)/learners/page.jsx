import { Users } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LearnersView } from "@/features/learners/components/LearnersView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Learners",
  description:
    "Your learner caseload — cohort dashboard, at-risk intervention queue, and learner profiles.",
  path: "/learners",
  noIndex: true,
});

export default function LearnersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Users}
        eyebrow="Caseload"
        title="Learners"
        description="Track your whole cohort, surface at-risk learners, and act on interventions."
      />
      <LearnersView />
    </div>
  );
}
