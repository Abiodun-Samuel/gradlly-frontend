import { FileText } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Curriculum",
  description: "Design and organise programme curriculum.",
  path: "/curriculum",
  noIndex: true,
});

export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileText}
        eyebrow="Portfolio"
        title="Curriculum"
        description="Design and organise programme curriculum."
      />
      <PortfolioView />
    </div>
  );
}
