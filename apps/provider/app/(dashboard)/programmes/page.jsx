import { GraduationCap } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ProgrammesTable } from "@/features/programmes/components/ProgrammesTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Programmes",
  description:
    "Manage your apprenticeship programmes — the top-level curriculum containers for your standards.",
  path: "/programmes",
  noIndex: true,
});

export default function ProgrammesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={GraduationCap}
        eyebrow="Curriculum"
        title="Programmes"
        description="Create and manage the programmes that group your apprenticeship standards."
      />
      <ProgrammesTable />
    </div>
  );
}
