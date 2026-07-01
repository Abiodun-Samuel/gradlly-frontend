import { Building2 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EmployerDirectory } from "@/features/reporting/components/EmployerDirectory";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Employers",
  description:
    "A directory of employers linked to your enrolments, with engagement metrics.",
  path: "/employers",
  noIndex: true,
});

export default function EmployersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Building2}
        eyebrow="Reporting"
        title="Employer directory"
        description="Employers linked to your enrolments — active learners, average OTJ, and commitment progress."
      />
      <EmployerDirectory />
    </div>
  );
}
