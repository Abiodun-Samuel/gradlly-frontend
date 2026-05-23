"use client";

import { HelpCircle, Settings, X } from "lucide-react";
import Link from "next/link";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { Avatar } from "@/components/ui/Avatar";
import { NAV_SECTIONS, UTILITY_LINKS } from "@/data/sidebar.data";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { capitalise, getFullName, getInitials } from "@/utils/helper";

import { SidebarNavSection } from "./SidebarNavSection";

// ─── Sub-blocks ───────────────────────────────────────────────────────────────
const UTILITY_ICON_MAP = { HelpCircle, Settings };

function OrgBlock({ org }) {
  const initial = (org?.name?.[0] ?? "A").toUpperCase();

  return (
    <div className="shrink-0 px-4 py-3">
      <div
        className="rounded-xl p-3.5"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top row: avatar + name + tier */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[18px] font-extrabold"
            style={{
              background: "linear-gradient(145deg, #2c6b44 0%, #143d27 100%)",
              color: "#78bf8d",
              boxShadow:
                "0 0 0 1px rgba(94,164,120,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {initial}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-[13.5px] font-bold leading-tight text-white/90">
              {org?.name ?? "Your Provider"}
            </p>
            <p
              className="mt-1 text-[10px] font-medium"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Apprentice Account
            </p>
          </div>
        </div>

        {/* Badge row */}
        <div
          className="mt-3 flex items-center gap-1.5 border-t pt-2.5"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(94,164,120,0.14)",
              color: "#78bf8d",
            }}
          >
            Apprentice
          </span>
          <span
            className="ml-auto flex items-center gap-1"
            style={{ color: "#78bf8d" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-success-400"
              aria-hidden
            />
            <span className="text-[10px] font-semibold">Active</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function UserBlock({ user, roles }) {
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const role = capitalise(roles?.[0] ?? "apprentice");

  return (
    <div
      className="shrink-0 px-3 py-2.5"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      >
        {/* Avatar with online dot */}
        <div className="relative shrink-0">
          <Avatar
            initials={initials}
            src={user?.avatarUrl}
            size="sm"
            className="ring-1 ring-white/10"
          />
          {user?.isActive && (
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success-400"
              style={{ outline: "2px solid #03090d" }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold leading-snug text-white/85">
            {fullName}
          </p>
          <p
            className="mt-0.5 truncate text-[10.5px] leading-none"
            style={{ color: "rgba(255,255,255,0.32)" }}
          >
            {role}
          </p>
        </div>

        <LogoutButton variant="sidebar" />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Sidebar({ onClose }) {
  const { user, activeOrganisation } = useAuthUser();
  const org = activeOrganisation?.organisation;
  const roles = activeOrganisation?.roles ?? [];

  return (
    <aside
      aria-label="Main navigation"
      className="relative flex h-full w-66 flex-col overflow-hidden"
      style={{ backgroundColor: "#03090d" }}
    >
      {/* Top shimmer line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-0.5 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(94,164,120,0.55) 50%, transparent 100%)",
        }}
      />

      {/* Brand lockup */}
      <div
        className="flex shrink-0 items-center justify-between px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link
          href="/"
          aria-label="Gradlly home"
          className="flex items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-primary-300 focus-visible:outline-offset-2"
        >
          <GradllyLogo size={34} />
          <span className="text-[16px] font-bold tracking-tight text-white/90">
            Gradlly
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: "rgba(94,164,120,0.14)",
              color: "#78bf8d",
            }}
          >
            Apprentice
          </span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-white/6 hover:text-white/60 focus-visible:outline-2 focus-visible:outline-primary-300 lg:hidden"
          >
            <X aria-hidden className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Org block */}
      <OrgBlock org={org} />

      {/* Thin divider */}
      <div
        className="mx-4 shrink-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
      />

      {/* Primary nav — scrollable */}
      <nav
        aria-label="Primary navigation"
        className="flex-1 overflow-y-auto py-1 scrollbar-none"
      >
        {NAV_SECTIONS.map((section) => (
          <SidebarNavSection key={section.title} section={section} />
        ))}
      </nav>

      {/* Utility links */}
      <nav
        className="shrink-0 py-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        aria-label="Utility navigation"
      >
        {UTILITY_LINKS.map(({ label, icon, href }) => {
          const Icon = UTILITY_ICON_MAP[icon];
          return (
            <Link
              key={href}
              href={href}
              className="mx-2 flex items-center gap-3 rounded-md px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150 hover:bg-white/[0.07] hover:text-white/70 focus-visible:outline-2 focus-visible:outline-primary-300 focus-visible:-outline-offset-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {Icon && (
                <Icon
                  aria-hidden
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                />
              )}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      <UserBlock user={user} roles={roles} />
    </aside>
  );
}
