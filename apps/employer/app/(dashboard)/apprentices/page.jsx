import { ApprenticesDashboard } from "@/components/apprentices/ApprenticesDashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "My Apprentices",
  description:
    "Monitor learner progress, OTJ tracking, and provider communication.",
  path: "/apprentices",
  noIndex: true,
});

export default function ApprenticesPage() {
  return <ApprenticesDashboard />;
}
