import { ClipboardCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OtjReviewQueue } from "@/features/otj-log-entries/components/OtjReviewQueue";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "OTJ Approvals",
  description: "Approve or reject apprentice off-the-job training hours.",
  path: "/approvals",
  noIndex: true,
});

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardCheck}
        eyebrow="Delivery"
        title="OTJ approvals"
        description="Review the off-the-job training hours your apprentices submit, then approve or reject them."
      />
      <OtjReviewQueue />
    </div>
  );
}
