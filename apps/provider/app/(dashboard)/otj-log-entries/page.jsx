import { Clock } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OtjReviewQueue } from "@/features/otj-log-entries/components/OtjReviewQueue";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "OTJ Log Entries",
  description:
    "Review off-the-job training hours submitted by your apprentices — approve or reject in bulk.",
  path: "/otj-log-entries",
  noIndex: true,
});

export default function OtjLogEntriesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Clock}
        eyebrow="Delivery"
        title="OTJ Log Entries"
        description="Review off-the-job training hours submitted by apprentices. Select submitted entries to approve or reject."
      />
      <OtjReviewQueue />
    </div>
  );
}
