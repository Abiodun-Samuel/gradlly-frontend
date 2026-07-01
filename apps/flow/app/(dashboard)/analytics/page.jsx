import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { SmeOverviewPanel } from "@/features/reporting/components/SmeOverviewPanel";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Analytics",
  description: "SME apprenticeship analytics and compliance overview.",
  path: "/analytics",
  noIndex: true,
});

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Analytics"
        title="SME analytics"
        description="Compliance metrics and apprentice performance overview."
      />
      <SmeOverviewPanel showPipeline={false} />
    </div>
  );
}
