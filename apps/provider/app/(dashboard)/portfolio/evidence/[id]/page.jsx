import { EvidenceDetailView } from "@/features/portfolio/components/EvidenceDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Evidence",
  description: "Review a KSB portfolio evidence item.",
  path: "/portfolio/evidence",
  noIndex: true,
});

export default async function EvidenceDetailPage({ params }) {
  const { id } = await params;
  return <EvidenceDetailView evidenceId={id} />;
}
