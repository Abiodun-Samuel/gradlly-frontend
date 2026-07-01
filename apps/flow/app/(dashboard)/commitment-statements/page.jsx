import { FileSignature } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { CommitmentStatementsTable } from "@/features/commitment-statements/components/CommitmentStatementsTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Commitment Statements",
  description:
    "Tripartite training plans across your apprentices — create, publish, and sign.",
  path: "/commitment-statements",
  noIndex: true,
});

export default function CommitmentStatementsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileSignature}
        eyebrow="Delivery"
        title="Commitment statements"
        description="The tripartite training plans for your apprentices. Manage each one from the apprentice's page."
      />
      <CommitmentStatementsTable />
    </div>
  );
}
