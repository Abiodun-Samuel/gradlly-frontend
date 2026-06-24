"use client";

import { useMemo, useState } from "react";

import { useApprenticeRoster } from "@/features/apprentices/queries/apprentices.query";

import { EnrolDrawer } from "./EnrolDrawer";
import { OTJAlert } from "./OTJAlert";
import { ProfilePanel } from "./ProfilePanel";
import { ProviderModal } from "./ProviderModal";
import { RosterTable } from "./RosterTable";
import { RosterToolbar } from "./RosterToolbar";
import { StatCards } from "./StatCards";
import { T } from "./tokens";

export function ApprenticesDashboard() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [contact, setContact] = useState(null);
  const [enrol, setEnrol] = useState(false);

  const { roster, isLoading } = useApprenticeRoster();

  const atRisk = useMemo(
    () => roster.filter((a) => a.status === "at_risk"),
    [roster],
  );

  const searchLower = search.toLowerCase();
  const visible = useMemo(
    () =>
      roster.filter((a) => {
        if (search === "") return true;
        return (
          a.name.toLowerCase().includes(searchLower) ||
          a.standard.toLowerCase().includes(searchLower) ||
          a.provider.toLowerCase().includes(searchLower) ||
          (a.employeeId ?? "").toLowerCase().includes(searchLower)
        );
      }),
    [roster, search, searchLower],
  );

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        style={{ color: T.muted }}
      >
        <p className="text-sm">Loading apprentices…</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <OTJAlert
        atRisk={atRisk}
        onContact={setContact}
        onViewProfile={setProfile}
      />

      <StatCards roster={roster} onFilter={setFilter} />

      {filter !== "all" && (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: T.blueLight,
              color: T.blue,
              border: `1px solid ${T.blue}20`,
            }}
          >
            Filtering:{" "}
            {filter === "on_track"
              ? "On track"
              : filter === "at_risk"
                ? "At risk"
                : "EPA < 90 days"}
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="hover:opacity-70"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <div className="space-y-3">
        <RosterToolbar
          filter={filter}
          search={search}
          onFilter={setFilter}
          onSearch={setSearch}
          onEnrol={() => setEnrol(true)}
        />
        <RosterTable
          apprentices={visible}
          filter={filter}
          onView={setProfile}
          onContact={setContact}
        />
      </div>

      {/* S4 — Profile panel */}
      {profile && (
        <ProfilePanel
          apprentice={profile}
          onClose={() => setProfile(null)}
          onContact={setContact}
        />
      )}

      {/* S5 — Provider modal */}
      <ProviderModal
        open={!!contact}
        apprentice={
          contact ?? {
            provider: "",
            name: "",
            standard: "",
            otjActual: 0,
            otjExpected: 0,
            providerContact: { name: "", email: "", phone: "" },
          }
        }
        onClose={() => setContact(null)}
      />

      <EnrolDrawer open={enrol} onClose={() => setEnrol(false)} />
    </div>
  );
}
