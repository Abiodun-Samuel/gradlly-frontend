import { Sparkles } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { AiProgrammeCatalogue } from "@/features/ai-programmes/components/AiProgrammeCatalogue";
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
        icon={Sparkles}
        eyebrow="Talent"
        title="AI programme catalogue"
        description="Platform-curated AI apprenticeship tracks. Pick one to view its modules and enrol an apprentice."
      />
      <AiProgrammeCatalogue />
    </div>
  );
}
