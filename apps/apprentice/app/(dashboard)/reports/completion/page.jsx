import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DocumentsList } from "@/features/documents/components/DocumentsList";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Completion Report",
  description: "Completion rates and trends.",
  path: "/reports/completion",
  noIndex: true,
});

export default function CompletionReportPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Documents"
        title="Completion Report"
        description="Completion rates and trends."
      />
      <DocumentsList types={["commitment", "review"]} />
    </div>
  );
}
