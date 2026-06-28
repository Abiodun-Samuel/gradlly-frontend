import { Dashboard } from "@/components/dashboard/Dashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Levy Dashboard",
  description:
    "Your Gradlly Employer levy dashboard — manage apprenticeship levy balance, transfers, and ROI.",
  path: "/",
  noIndex: true,
});

export default function DashboardHomePage() {
  return <Dashboard />;
}
