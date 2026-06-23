import { Users } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ApprenticesTable } from "@/features/apprentices/components/ApprenticesTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Apprentices",
  description:
    "Manage the learners in your organisation and enrol them onto apprenticeship standards.",
  path: "/apprentices",
  noIndex: true,
});

export default function ApprenticesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Users}
        eyebrow="Learners"
        title="Apprentices"
        description="Add and manage the learners in your organisation."
      />
      <ApprenticesTable />
    </div>
  );
}
