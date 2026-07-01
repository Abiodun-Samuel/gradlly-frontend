import { EligibilityChecker } from "@/features/levy-exchange/components/EligibilityChecker";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Check levy transfer eligibility",
  description:
    "See in under a minute whether your business qualifies for apprenticeship levy transfer funding.",
  path: "/eligibility",
  noIndex: true,
});

export default function EligibilityPage() {
  return <EligibilityChecker />;
}
