import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { AnalyticsStats } from "@/features/analytics/components/AnalyticsStats";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Analytics",
  description: "Programme analytics and performance.",
  path: "/analytics",
  noIndex: true,
});

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Insights"
        title="Analytics"
        description="Programme analytics and performance."
      />
      <AnalyticsStats />
    </div>
  );
}
