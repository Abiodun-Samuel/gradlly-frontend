import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { SmeOverviewPanel } from "@/features/reporting/components/SmeOverviewPanel";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reports",
  description: "SME compliance and apprenticeship reporting.",
  path: "/reports",
  noIndex: true,
});

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Reporting"
        title="SME compliance reports"
        description="Apprentice roster, OTJ approvals, and commitment pipeline."
      />
      <SmeOverviewPanel />
    </div>
  );
}
