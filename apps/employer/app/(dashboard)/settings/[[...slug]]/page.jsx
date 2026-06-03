import { createPageSeo } from "@/utils/metadata";

import { SettingsView } from "./SettingsView";

export const { metadata } = createPageSeo({
  title: "Settings",
  description:
    "Manage your organisation settings, team members, and invitations.",
  path: "/settings",
  noIndex: true,
});

const VALID_TABS = ["team", "notifications"];

export default async function SettingsPage({ params }) {
  const { slug } = await params;
  const requested = Array.isArray(slug) ? slug[0] : undefined;
  const activeTab = VALID_TABS.includes(requested) ? requested : "team";

  return <SettingsView activeTab={activeTab} />;
}
