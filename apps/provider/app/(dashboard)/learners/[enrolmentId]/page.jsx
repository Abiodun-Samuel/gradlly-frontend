import { LearnerProfileView } from "@/features/learners/components/LearnerProfileView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Learner",
  description:
    "A 360° view of one learner — progress, reviews, OTJ, documents.",
  path: "/learners",
  noIndex: true,
});

export default async function LearnerProfilePage({ params }) {
  const { enrolmentId } = await params;
  return <LearnerProfileView enrolmentId={enrolmentId} />;
}
