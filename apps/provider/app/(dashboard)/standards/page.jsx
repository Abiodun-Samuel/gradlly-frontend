import { BookMarked } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { StandardsTable } from "@/features/standards/components/StandardsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Standards",
  description:
    "Manage your apprenticeship standards — each belongs to a programme and is referenced by enrolments.",
  path: "/standards",
  noIndex: true,
});

export default function StandardsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BookMarked}
        eyebrow="Curriculum"
        title="Standards"
        description="Create and manage the apprenticeship standards that sit under your programmes."
      />
      <StandardsTable />
    </div>
  );
}
