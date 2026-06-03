import { Settings2 } from "lucide-react";

import { EmptyPage } from "@/components/ui/EmptyPage";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Settings",
  description: "Configure your learning portal preferences.",
  path: "/settings",
  noIndex: true,
});

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Settings2}
        title="Settings"
        description="Configure your learning portal preferences."
      />
      <EmptyPage
        title="Preferences"
        description="Settings are coming soon. You will be able to manage your profile, notifications, and learning preferences here."
      />
    </div>
  );
}
