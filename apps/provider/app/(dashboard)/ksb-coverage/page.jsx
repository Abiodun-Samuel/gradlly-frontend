import { BookOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { KsbCoverageTable } from "@/features/portfolio/components/KsbCoverageTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "KSB Coverage",
  description: "Portfolio KSB heatmap coverage across your learner cohort.",
  path: "/ksb-coverage",
  noIndex: true,
});

export default function KsbCoveragePage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BookOpen}
        eyebrow="Insights"
        title="KSB Coverage"
        description="Review knowledge, skills, and behaviour evidence strength by learner."
      />
      <KsbCoverageTable />
    </div>
  );
}
