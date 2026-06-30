import { ShieldCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OfstedHub } from "@/features/ofsted/components/OfstedHub";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Ofsted Hub",
  description:
    "EIF readiness scores, the Quality Improvement Plan, safeguarding, programme documents, and the inspector evidence pack.",
  path: "/ofsted-hub",
  noIndex: true,
});

export default function OfstedHubPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ShieldCheck}
        eyebrow="Quality"
        title="Ofsted Hub"
        description="Track EIF inspection readiness, manage your Quality Improvement Plan, safeguarding, and curriculum documents."
      />
      <OfstedHub />
    </div>
  );
}
