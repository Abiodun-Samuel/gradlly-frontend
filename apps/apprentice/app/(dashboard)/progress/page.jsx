import { TrendingUp } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OtjLogTable } from "@/features/otj/components/OtjLogTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Progress",
  description: "Track learner progress across the programme.",
  path: "/progress",
  noIndex: true,
});

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={TrendingUp}
        eyebrow="Learning"
        title="Progress"
        description="Log off-the-job training entries and track submission status."
      />
      <OtjLogTable />
    </div>
  );
}
