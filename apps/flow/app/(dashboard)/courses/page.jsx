import { BookOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { AiProgrammeCatalogueTable } from "@/features/ai-programmes/components/AiProgrammeCatalogueTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "AI Programmes",
  description: "Browse FlowPortal AI apprenticeship programmes.",
  path: "/courses",
  noIndex: true,
});

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BookOpen}
        eyebrow="Programmes"
        title="AI programme catalogue"
        description="FlowPortal AI apprenticeship tracks available to your organisation."
      />
      <AiProgrammeCatalogueTable />
    </div>
  );
}
