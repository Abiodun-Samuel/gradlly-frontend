import { Coins } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LevySurplusTable } from "@/features/levy-exchange/components/LevySurplusTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Levy Surplus",
  description: "View levy surplus and transfer capacity.",
  path: "/levy",
  noIndex: true,
});

export default function LevyPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Coins}
        eyebrow="Levy Exchange"
        title="Levy surplus"
        description="Available surplus per linked donor account after commitments."
      />
      <LevySurplusTable />
    </div>
  );
}
