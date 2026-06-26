import { ShieldCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OfstedHubSummary } from "@/features/ofsted/components/EifScoresPanel";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Ofsted Hub",
  description: "Inspection readiness, EIF scores, and evidence preparation.",
  path: "/ofsted-hub",
  noIndex: true,
});

export default function OfstedHubPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ShieldCheck}
        eyebrow="Compliance"
        title="Ofsted Hub"
        description="Monitor EIF readiness and prepare inspection evidence."
      />
      <OfstedHubSummary />
    </div>
  );
}
