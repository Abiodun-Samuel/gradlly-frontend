import { ClipboardList } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ReviewsTable } from "@/features/reviews/components/ReviewsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Assessments",
  description: "Review and grade learner assessments.",
  path: "/assessments",
  noIndex: true,
});

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardList}
        eyebrow="Reviews"
        title="Assessments"
        description="Review and grade learner assessments."
      />
      <ReviewsTable />
    </div>
  );
}
