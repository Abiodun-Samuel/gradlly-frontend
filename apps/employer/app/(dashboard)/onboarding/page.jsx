import { UserPlus } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OtjApprovalsTable } from "@/features/otj/components/OtjApprovalsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Onboarding",
  description: "New apprentice checklists.",
  path: "/onboarding",
  noIndex: true,
});

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={UserPlus}
        eyebrow="Approvals"
        title="Onboarding"
        description="Review and approve submitted off-the-job training from your apprentices."
      />
      <OtjApprovalsTable />
    </div>
  );
}
