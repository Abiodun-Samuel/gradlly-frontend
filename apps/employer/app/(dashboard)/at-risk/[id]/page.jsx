import { AtRiskDetail } from "@/components/at-risk/AtRiskDetail";

export const metadata = {
  title: "Apprentice At-Risk Profile · Learnflo Employer Portal",
};

export default function AtRiskDetailPage({ params }) {
  return <AtRiskDetail id={params.id} />;
}
