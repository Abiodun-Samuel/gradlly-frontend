import { FileText } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { IlrRecordsTable } from "@/features/ilr/components/IlrRecordsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "ILR & DAS",
  description: "Manage ILR learner records and submission readiness.",
  path: "/ilr-das",
  noIndex: true,
});

export default function IlrDasPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileText}
        eyebrow="Compliance"
        title="ILR & DAS"
        description="Build, validate, and track ILR learner records for submission."
      />
      <IlrRecordsTable />
    </div>
  );
}
