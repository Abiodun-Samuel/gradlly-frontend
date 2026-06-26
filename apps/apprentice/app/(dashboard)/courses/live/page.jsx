import { BookOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EnrolmentsTable } from "@/features/enrolments/components/EnrolmentsTable";
import { ENROLMENT_STATUS } from "@/features/enrolments/constants";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Live Courses",
  description: "Currently available to learners.",
  path: "/courses/live",
  noIndex: true,
});

export default function LiveCoursesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BookOpen}
        eyebrow="Learning"
        title="Live Courses"
        description="Currently available to learners."
      />
      <EnrolmentsTable statusFilter={ENROLMENT_STATUS.ACTIVE} />
    </div>
  );
}
