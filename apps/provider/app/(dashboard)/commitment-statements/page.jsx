import { ClipboardList } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { CommitmentStatementsTable } from "@/features/commitments/components/CommitmentStatementsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Commitment Statements",
  description: "Apprenticeship commitment statements across your cohort.",
  path: "/commitment-statements",
  noIndex: true,
});

export default function CommitmentStatementsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardList}
        eyebrow="Delivery"
        title="Commitment Statements"
        description="Track commitment statement versions and signature status."
      />
      <CommitmentStatementsTable />
    </div>
  );
}
