import { LevyTransferDashboard } from "@/components/levy-transfer/LevyTransferDashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Levy Transfer",
  description:
    "Manage ESFA-compliant levy transfers to SME partners in your supply chain.",
  path: "/levy-transfer",
  noIndex: true,
});

export default function LevyTransferPage() {
  return <LevyTransferDashboard />;
}
