import { LearnerProgressView } from "@/features/ai-programmes/components/LearnerProgressView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Learner progress",
  description: "Track an apprentice's AI programme module progress.",
  path: "/learners",
  noIndex: true,
});

export default async function LearnerProgressPage({ params }) {
  const { enrolmentId } = await params;
  return <LearnerProgressView enrolmentId={enrolmentId} />;
}
