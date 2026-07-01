import { ShieldCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EifScoresPanel } from "@/features/ofsted/components/EifScoresPanel";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "EIF Scores",
  description: "Detailed EIF criterion readiness scores for your organisation.",
  path: "/ofsted-hub/eif-scores",
  noIndex: true,
});

export default function EifScoresPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ShieldCheck}
        eyebrow="Ofsted Hub"
        title="EIF Scores"
        description="Criterion-level readiness percentages and RAG bands."
      />
      <EifScoresPanel />
    </div>
  );
}
