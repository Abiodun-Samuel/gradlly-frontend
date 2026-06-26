import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LevyRoiView } from "@/features/reporting/components/LevyRoiView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Cost Reports",
  description: "Hiring cost breakdowns.",
  path: "/analytics/cost",
  noIndex: true,
});

export default function CostReportsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Levy"
        title="Cost Reports"
        description="Hiring cost breakdowns."
      />
      <LevyRoiView />
    </div>
  );
}
