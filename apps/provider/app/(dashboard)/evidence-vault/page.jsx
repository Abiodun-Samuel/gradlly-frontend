import { FolderLock } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EvidenceVaultTable } from "@/features/evidence/components/EvidenceVaultTable";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Evidence Vault",
  description: "Browse portfolio evidence items across your learner cohort.",
  path: "/evidence-vault",
  noIndex: true,
});

export default function EvidenceVaultPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FolderLock}
        eyebrow="Compliance"
        title="Evidence Vault"
        description="Signed documents, review records, and accepted portfolio evidence."
      />
      <EvidenceVaultTable />
    </div>
  );
}
