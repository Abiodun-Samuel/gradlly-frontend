import { ClipboardCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ReviewsTable } from "@/features/reviews/components/ReviewsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reviews",
  description:
    "Schedule and track tripartite progress reviews across your enrolments.",
  path: "/reviews",
  noIndex: true,
});

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardCheck}
        eyebrow="Delivery"
        title="Reviews"
        description="Tripartite progress reviews — schedule, record, and sign off. Reviews are scheduled from an enrolment."
      />
      <ReviewsTable />
    </div>
  );
}
