import { Activity } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DasPushesView } from "@/features/das-pushes/components/DasPushesView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "DAS Delivery Health",
  description:
    "Monitor failed DAS pushes across the enrolment, completion, and withdrawal pipelines, and re-queue them.",
  path: "/das-health",
  noIndex: true,
});

export default function DasHealthPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Activity}
        eyebrow="Funding"
        title="DAS delivery health"
        description="Failed DAS pushes across the three pipelines. Inspect a failure and re-queue delivery."
      />
      <DasPushesView />
    </div>
  );
}
