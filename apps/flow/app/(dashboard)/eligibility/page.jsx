import { CheckCircle2 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EligibilityCheckForm } from "@/features/levy-exchange/components/EligibilityCheckForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Eligibility",
  description: "Check SME levy transfer eligibility.",
  path: "/eligibility",
  noIndex: true,
});

export default function EligibilityPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={CheckCircle2}
        eyebrow="Levy Exchange"
        title="Eligibility checker"
        description="Assess whether your organisation qualifies for levy transfer support."
      />
      <EligibilityCheckForm />
    </div>
  );
}
