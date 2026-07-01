import { Handshake } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { MatchResultsTable } from "@/features/levy-exchange/components/MatchResultsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Matches",
  description: "Search levy donor matches.",
  path: "/matches",
  noIndex: true,
});

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Handshake}
        eyebrow="Levy Exchange"
        title="Donor matches"
        description="Rule-based donor matches ranked by sector, region, and surplus."
      />
      <MatchResultsTable />
    </div>
  );
}
