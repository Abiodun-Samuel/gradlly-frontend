import { Link2 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DonorLinksTable } from "@/features/levy-exchange/components/DonorLinksTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Donor Links",
  description: "Manage DAS donor account connections.",
  path: "/donor-links",
  noIndex: true,
});

export default function DonorLinksPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Link2}
        eyebrow="Levy Exchange"
        title="Donor DAS links"
        description="Connected donor accounts used for levy balance sync and transfers."
      />
      <DonorLinksTable />
    </div>
  );
}
