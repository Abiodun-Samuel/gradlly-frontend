"use client";

import { Bell, Settings2, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { EmptyPage } from "@/components/ui/EmptyPage";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { TabNav } from "@/components/ui/TabNav";
import { InvitationsTable } from "@/features/invitations/components/InvitationsTable";

const TABS = [
  { value: "team", label: "Team & Invitations", icon: UsersRound },
  { value: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsView({ activeTab = "team" }) {
  const router = useRouter();
  const setTab = (value) => router.push(`/settings/${value}`);

  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Settings2}
        eyebrow="Workspace"
        title="Settings"
        description="Manage your organisation preferences, team members, and notifications."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Tab rail: horizontal on small screens, vertical on large screens. */}
        <aside className="lg:w-60 lg:shrink-0">
          <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm lg:sticky lg:top-4">
            <TabNav
              tabs={TABS}
              value={activeTab}
              onChange={setTab}
              ariaLabel="Settings sections"
            />
          </div>
        </aside>

        {/* Active panel */}
        <section
          className="min-w-0 flex-1"
          role="tabpanel"
          aria-label={activeTab}
        >
          {activeTab === "team" ? (
            <InvitationsTable />
          ) : (
            <EmptyPage
              title="Notifications"
              description="Notification preferences are coming soon. You will be able to choose which events email you and which appear in-app."
            />
          )}
        </section>
      </div>
    </div>
  );
}
