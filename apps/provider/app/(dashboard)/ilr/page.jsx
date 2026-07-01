import { FileSpreadsheet } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { IlrView } from "@/features/ilr/components/IlrView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "ILR / ESFA",
  description:
    "Build, validate, submit, and amend your ILR learner records for the ESFA.",
  path: "/ilr",
  noIndex: true,
});

export default function IlrPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileSpreadsheet}
        eyebrow="Compliance"
        title="ILR / ESFA"
        description="Build ILR records from enrolments, validate against ILR rules, and submit your statutory return to the ESFA."
      />
      <IlrView />
    </div>
  );
}
