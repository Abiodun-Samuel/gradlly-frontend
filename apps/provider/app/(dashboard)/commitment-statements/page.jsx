import { FileSignature } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { CommitmentStatementsTable } from "@/features/commitment-statements/components/CommitmentStatementsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Commitment Statements",
  description:
    "Tripartite training plans signed by apprentice, tutor and employer manager across your enrolments.",
  path: "/commitment-statements",
  noIndex: true,
});

export default function CommitmentStatementsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileSignature}
        eyebrow="Delivery"
        title="Commitment Statements"
        description="The tripartite training plans for your enrolments. Create, publish and sign each from its enrolment."
      />
      <CommitmentStatementsTable />
    </div>
  );
}
