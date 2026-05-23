"use client";

import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Menu,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { capitalise, cn, getFullName, getInitials } from "@/utils/helper";

import { HeaderNotifications } from "./HeaderNotifications";
import { UserMenu } from "./UserMenu";

// ─── Breadcrumb map ───────────────────────────────────────────────────────────

const BREADCRUMBS = {
  "/": { parent: "Overview", current: "Dashboard" },
  "/cohort": { parent: "Overview", current: "Cohort" },
  "/at-risk": { parent: "Overview", current: "At-Risk Queue" },
  "/ofsted-hub": { parent: "Compliance", current: "Ofsted Hub" },
  "/qip": { parent: "Compliance", current: "QIP" },
  "/ilr-das": { parent: "Compliance", current: "ILR & DAS" },
  "/evidence-vault": { parent: "Compliance", current: "Evidence Vault" },
  "/reviews": { parent: "Delivery", current: "Reviews" },
  "/tutors": { parent: "Delivery", current: "Tutors" },
  "/employers": { parent: "Delivery", current: "Employers" },
  "/commitment-statements": {
    parent: "Delivery",
    current: "Commitment Statements",
  },
  "/reports": { parent: "Insights", current: "Reports" },
  "/ksb-coverage": { parent: "Insights", current: "KSB Coverage" },
  "/settings": { parent: "Account", current: "Settings" },
  "/profile": { parent: "Account", current: "Profile" },
  "/help": { parent: "Support", current: "Help & Docs" },
};

// ─── Shared icon-button class ─────────────────────────────────────────────────

const ICON_BTN = cn(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
  "text-neutral-500 transition-colors duration-150",
  "hover:bg-neutral-100 hover:text-neutral-700",
  "focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2",
);

// ─── Component ────────────────────────────────────────────────────────────────

export function Header({ onMenuOpen, userMenuOpen, onUserMenuOpenChange }) {
  const { user, activeOrganisation } = useAuthUser();
  const pathname = usePathname();
  const avatarRef = useRef(null);

  const breadcrumb = BREADCRUMBS[pathname] ?? {
    parent: "Overview",
    current: "Dashboard",
  };
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const role = capitalise(activeOrganisation?.roles?.[0] ?? "member");

  return (
    <header
      className="sticky top-0 z-200 flex h-16 shrink-0 items-center border-b border-neutral-100 px-4 sm:px-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <a href="#main-content" className="sr-only-focusable">
        Skip to content
      </a>

      {/* ── Left: hamburger + breadcrumb ─────────────────────────── */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className={cn(ICON_BTN, "lg:hidden")}
        >
          <Menu aria-hidden className="h-4.5 w-4.5" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li className="hidden text-xs font-medium text-neutral-400 sm:block">
              {breadcrumb.parent}
            </li>
            <li aria-hidden className="hidden sm:block">
              <ChevronRight className="h-3 w-3 text-neutral-300" />
            </li>
            <li>
              <span
                aria-current="page"
                className="text-sm font-semibold text-neutral-800"
              >
                {breadcrumb.current}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* ── Right: actions + notifications + user ────────────────── */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Settings shortcut */}
        <Link
          href="/settings"
          aria-label="Settings"
          className={ICON_BTN}
          title="Settings"
        >
          <Settings aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
        </Link>

        {/* Help / Docs */}
        <Link
          href="/help"
          aria-label="Help and docs"
          className={ICON_BTN}
          title="Help & Docs"
        >
          <HelpCircle aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
        </Link>

        {/* Notifications */}
        <HeaderNotifications />

        {/* Separator */}
        <div aria-hidden className="mx-1.5 h-5 w-px bg-neutral-200" />

        {/* User button */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => onUserMenuOpenChange?.(!userMenuOpen)}
            aria-label="Open user menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            className={cn(
              "flex items-center gap-2 rounded-xl px-2 py-1.5",
              "transition-colors duration-150",
              "hover:bg-neutral-100",
              "focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2",
              userMenuOpen && "bg-neutral-100",
            )}
          >
            <Avatar
              initials={initials}
              src={user?.avatarUrl}
              size="sm"
              className="shrink-0 ring-2 ring-primary-100"
            />
            <div className="hidden min-w-0 text-left sm:block">
              <p className="text-[13px] font-semibold leading-snug text-neutral-800">
                {fullName}
              </p>
              <p className="text-[11px] leading-none text-neutral-400">
                {role}
              </p>
            </div>
            <ChevronDown
              aria-hidden
              className={cn(
                "hidden h-3 w-3 shrink-0 text-neutral-400 transition-transform duration-150 sm:block",
                userMenuOpen && "rotate-180",
              )}
            />
          </button>

          <UserMenu
            open={userMenuOpen}
            onClose={() => onUserMenuOpenChange?.(false)}
            anchorRef={avatarRef}
          />
        </div>
      </div>
    </header>
  );
}
