import { FileText } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EvidenceQueue } from "@/features/portfolio/components/EvidenceQueue";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Evidence Review",
  description:
    "Review KSB portfolio evidence submitted by apprentices — review, accept or return.",
  path: "/portfolio/evidence",
  noIndex: true,
});

export default function EvidenceReviewPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileText}
        eyebrow="Portfolio"
        title="Evidence review"
        description="KSB portfolio evidence across your enrolments. Review, accept, or return submissions."
      />
      <EvidenceQueue />
    </div>
  );
}
