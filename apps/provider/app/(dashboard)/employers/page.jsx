import { Building2 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EmployersTable } from "@/features/employers/components/EmployersTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Employers",
  description:
    "Employer directory with learner counts and commitment pipeline.",
  path: "/employers",
  noIndex: true,
});

export default function EmployersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Building2}
        eyebrow="Delivery"
        title="Employers"
        description="Linked employers, contacts, and delivery metrics."
      />
      <EmployersTable />
    </div>
  );
}
