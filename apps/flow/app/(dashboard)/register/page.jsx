import { FileText } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { RegistrationPanel } from "@/features/flowportal-registration/components/RegistrationPanel";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Registration",
  description: "ESFA employer registration wizard.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileText}
        eyebrow="Onboarding"
        title="ESFA registration"
        description="Start or resume your Digital Apprenticeship Service employer registration."
      />
      <RegistrationPanel />
    </div>
  );
}
