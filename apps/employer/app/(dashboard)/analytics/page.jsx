import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LevyUtilisationView } from "@/features/reporting/components/LevyUtilisationView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Analytics",
  description: "Recruitment analytics and insights.",
  path: "/analytics",
  noIndex: true,
});

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Levy"
        title="Analytics"
        description="Recruitment analytics and insights."
      />
      <LevyUtilisationView />
    </div>
  );
}
