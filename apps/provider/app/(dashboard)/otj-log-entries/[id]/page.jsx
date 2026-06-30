import { OtjEntryDetailView } from "@/features/otj-log-entries/components/OtjEntryDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "OTJ Log Entry",
  description:
    "Review an off-the-job training log entry, its evidence, and approve or reject it.",
  path: "/otj-log-entries",
  noIndex: true,
});

export default async function OtjEntryDetailPage({ params }) {
  const { id } = await params;
  return <OtjEntryDetailView entryId={id} />;
}
