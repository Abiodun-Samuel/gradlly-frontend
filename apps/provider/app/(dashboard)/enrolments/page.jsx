import { ClipboardList } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EnrolmentsTable } from "@/features/enrolments/components/EnrolmentsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Enrolments",
  description:
    "Manage apprenticeship enrolments — link apprentices to standards and track their lifecycle.",
  path: "/enrolments",
  noIndex: true,
});

export default function EnrolmentsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardList}
        eyebrow="Delivery"
        title="Enrolments"
        description="Link apprentices to standards and progress them through activation, delivery, and EPA."
      />
      <EnrolmentsTable />
    </div>
  );
}
