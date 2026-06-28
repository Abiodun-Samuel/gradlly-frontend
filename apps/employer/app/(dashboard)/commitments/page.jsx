import { CommitmentsDashboard } from "@/components/commitments/CommitmentsDashboard";

export const metadata = {
  title: "Commitments — Learnflo",
  description: "Manage tripartite commitment statements for ESFA compliance.",
};

export default function CommitmentsPage() {
  return <CommitmentsDashboard />;
}
