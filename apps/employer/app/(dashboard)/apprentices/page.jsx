import { Users } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EnrolmentsTable } from "@/features/enrolments/components/EnrolmentsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Apprentices",
  description: "Manage and view all your active apprentices.",
  path: "/apprentices",
  noIndex: true,
});

export default function ApprenticesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Users}
        eyebrow="Team"
        title="Apprentices"
        description="Manage and view all your active apprentices."
      />
      <EnrolmentsTable />
    </div>
  );
}
