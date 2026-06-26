import { CalendarCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ReviewsTable } from "@/features/reviews/components/ReviewsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reviews",
  description: "Schedule and manage progress reviews across your cohort.",
  path: "/reviews",
  noIndex: true,
});

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={CalendarCheck}
        eyebrow="Delivery"
        title="Reviews"
        description="Track scheduled, in-progress, and completed progress reviews."
      />
      <ReviewsTable />
    </div>
  );
}
