import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DocumentsList } from "@/features/documents/components/DocumentsList";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reports",
  description: "Generate programme delivery reports.",
  path: "/reports",
  noIndex: true,
});

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Documents"
        title="Reports"
        description="Generate programme delivery reports."
      />
      <DocumentsList />
    </div>
  );
}
