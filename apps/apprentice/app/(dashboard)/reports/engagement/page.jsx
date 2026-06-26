import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DocumentsList } from "@/features/documents/components/DocumentsList";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Engagement Report",
  description: "Engagement and activity metrics.",
  path: "/reports/engagement",
  noIndex: true,
});

export default function EngagementReportPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Documents"
        title="Engagement Report"
        description="Engagement and activity metrics."
      />
      <DocumentsList types={["review", "evidence"]} />
    </div>
  );
}
