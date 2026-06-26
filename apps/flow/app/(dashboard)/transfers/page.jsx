import { ArrowRightLeft } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { MatchApplicationsTable } from "@/features/levy-exchange/components/MatchApplicationsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Transfers",
  description: "Levy transfer applications and pipeline.",
  path: "/transfers",
  noIndex: true,
});

export default function TransfersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ArrowRightLeft}
        eyebrow="Levy Exchange"
        title="Transfer applications"
        description="Match applications progressing toward levy transfers."
      />
      <MatchApplicationsTable />
    </div>
  );
}
