import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Reports",
  description:
    "Levy ROI, completion rates, EPA forecasts, and provider performance for Midlands Engineering Ltd.",
  path: "/reports",
  noIndex: true,
});

export default function ReportsPage() {
  return <ReportsDashboard />;
}
