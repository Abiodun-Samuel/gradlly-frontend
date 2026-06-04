"use client";

import { Building2, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Avatar } from "@/components/ui/Avatar";
import TextBadge from "@/components/ui/TextBadge";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  capitalise,
  cn,
  formatDateTime,
  getFullName,
  getInitials,
} from "@/utils/helper";

// ─── Menu items ───────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

// ─── Organisation mini-box ────────────────────────────────────────────────────

function OrgMiniBox({ activeOrganisation }) {
  const org = activeOrganisation?.organisation;
  const roles = activeOrganisation?.roles ?? [];
  const roleLabel = roles.length ? capitalise(roles[0]) : null;
  const membershipStatus = activeOrganisation?.membershipStatus ?? null;

  if (!org) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
            <Building2 className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-700">
              No organisation yet
            </p>
            <p className="truncate text-[11px] text-neutral-400">
              You will appear here once you join one.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initial = org.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="px-4 py-3">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-700 text-[13px] font-bold text-white shadow-sm">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900">
              {org.name}
            </p>
            {roleLabel ? (
              <p className="truncate text-[11px] font-medium text-neutral-500">
                {roleLabel}
              </p>
            ) : null}
          </div>
          {membershipStatus === "active" ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
              <span
                className="size-1.5 rounded-full bg-green-500"
                aria-hidden
              />
              Active
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserMenu({ open, onClose, anchorRef }) {
  const { user, activeOrganisation } = useAuthUser();
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const lastLogin = formatDateTime(user?.lastLoginAt);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      )
        onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="User menu"
      className={cn(
        "absolute right-0 top-full z-50 mt-2",
        "w-72 max-w-[calc(100vw-1rem)]",
        "overflow-hidden rounded-xl border border-neutral-200 bg-white",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        "animate-[slide-up_200ms_cubic-bezier(0.16,1,0.3,1)_forwards]",
      )}
    >
      {/* User identity header (no role — role belongs to the org box below) */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            initials={initials}
            src={user?.avatarUrl}
            size="md"
            className="shrink-0 ring-2 ring-primary-100"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {fullName}
            </p>
            <p className="truncate text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {user?.isEmailVerified ? (
            <TextBadge variant="light" color="green" size="xs">
              Verified
            </TextBadge>
          ) : (
            <TextBadge variant="light" color="amber" size="xs">
              Unverified
            </TextBadge>
          )}
          {lastLogin ? (
            <span className="text-[11px] tabular-nums text-neutral-400">
              Last login · {lastLogin}
            </span>
          ) : null}
        </div>
      </div>

      {/* Organisation mini-box */}
      <div className="border-t border-neutral-100">
        <OrgMiniBox activeOrganisation={activeOrganisation} />
      </div>

      {/* Menu items */}
      <div className="border-t border-neutral-100 py-1">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            role="menuitem"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 transition-colors duration-100 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:outline-none"
          >
            <item.icon
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-neutral-400"
              strokeWidth={1.75}
            />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="border-t border-neutral-100 py-1">
        <LogoutButton variant="menu" />
      </div>
    </div>
  );
}
