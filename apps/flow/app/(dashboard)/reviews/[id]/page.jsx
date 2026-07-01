import { ReviewDetailView } from "@/features/reviews/components/ReviewDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Review",
  description: "View a progress review, fill its record, and manage signing.",
  path: "/reviews",
  noIndex: true,
});

export default async function ReviewDetailPage({ params }) {
  const { id } = await params;
  return <ReviewDetailView reviewId={id} />;
}
