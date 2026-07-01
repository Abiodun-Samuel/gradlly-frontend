import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ReportsSummary } from "@/features/reporting/components/ReportsSummary";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reports",
  description: "Provider delivery and compliance reporting overview.",
  path: "/reports",
  noIndex: true,
});

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Insights"
        title="Reports"
        description="Summary metrics for cohort delivery, ILR readiness, and EIF scores."
      />
      <ReportsSummary />
    </div>
  );
}
