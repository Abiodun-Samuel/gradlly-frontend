import { AiProgrammeDetail } from "@/features/ai-programmes/components/AiProgrammeDetail";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "AI Programme",
  description: "AI apprenticeship programme detail and module outline.",
  path: "/courses",
  noIndex: true,
});

export default async function AiProgrammeDetailPage({ params }) {
  const { id } = await params;
  return <AiProgrammeDetail programmeId={id} />;
}
