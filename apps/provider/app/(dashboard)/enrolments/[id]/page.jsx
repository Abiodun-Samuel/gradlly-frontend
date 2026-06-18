import { EnrolmentDetailView } from "@/features/enrolments/components/EnrolmentDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Enrolment",
  description:
    "View an enrolment's lifecycle, journey, gateway, and EPA progress.",
  path: "/enrolments",
  noIndex: true,
});

export default async function EnrolmentDetailPage({ params }) {
  const { id } = await params;
  return <EnrolmentDetailView enrolmentId={id} />;
}
