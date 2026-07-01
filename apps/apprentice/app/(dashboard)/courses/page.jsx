import { BookOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EnrolmentsTable } from "@/features/enrolments/components/EnrolmentsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Courses",
  description: "Manage all your courses and learning content.",
  path: "/courses",
  noIndex: true,
});

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BookOpen}
        eyebrow="Learning"
        title="Courses"
        description="Manage all your courses and learning content."
      />
      <EnrolmentsTable />
    </div>
  );
}
