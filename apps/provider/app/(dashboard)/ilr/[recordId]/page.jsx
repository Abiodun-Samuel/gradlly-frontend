import { IlrRecordDetailView } from "@/features/ilr/components/IlrRecordDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "ILR Record",
  description: "Validate, submit, and amend an ILR learner record.",
  path: "/ilr",
  noIndex: true,
});

export default async function IlrRecordPage({ params }) {
  const { recordId } = await params;
  return <IlrRecordDetailView recordId={recordId} />;
}
