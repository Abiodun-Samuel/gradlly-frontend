"use client";

import { cn } from "@gradlly/utils";
import { ChevronDown, HelpCircle, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { profileData, portalMeta } from "@/data/sidebar.data";

const menuItems = [
  { label: "My Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help & docs", icon: HelpCircle, href: "/help" },
];

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onPointer(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const hasStats = profileData.stats?.length > 0;

  return (
    <div ref={ref} className="relative">
      {/* ── Rich trigger ──────────────────────────────── */}
      <button
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border border-(--color-border) py-1.5 pl-1.5 pr-3",
          "transition-all duration-150 hover:bg-surface-2 active:scale-[0.99]",
          open && "bg-surface-2",
        )}
      >
        {/* avatar + online dot */}
        <div className="relative shrink-0">
          <div
            className="flex size-8 items-center justify-center rounded-xl text-xs font-bold text-accent-fg"
            style={{
              background:
                "linear-gradient(135deg,var(--portal-accent) 0%,var(--portal-accent-hover) 100%)",
              boxShadow:
                "0 2px 8px color-mix(in srgb,var(--portal-accent) 35%,transparent)",
            }}
          >
            {profileData.initials}
          </div>
          {profileData.isOnline && (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 size-[9px] rounded-full border-2 bg-emerald-400"
              style={{ borderColor: "var(--portal-header-bg,#fff)" }}
            />
          )}
        </div>

        {/* name + role — sm+ */}
        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-[13px] font-semibold leading-none text-text-primary">
            {profileData.name}
          </p>
          <p className="mt-[5px] truncate text-2xs leading-none text-text-tertiary">
            {profileData.role}
          </p>
        </div>

        {/* divider — lg+ */}
        {(profileData.cohort || hasStats) && (
          <div
            aria-hidden="true"
            className="hidden h-6 w-px bg-surface-3 lg:block"
          />
        )}

        {/* status + cohort — lg+ */}
        {profileData.cohort && (
          <div className="hidden flex-col gap-0.5 lg:flex">
            <div className="flex items-center gap-1.5">
              {profileData.isOnline && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span
                    aria-hidden="true"
                    className="size-[5px] rounded-full bg-emerald-500"
                  />
                  Active
                </span>
              )}
              <span className="text-[11px] text-text-tertiary">
                · {profileData.cohort}
              </span>
            </div>
          </div>
        )}

        {/* divider — xl+ */}
        {hasStats && (
          <div
            aria-hidden="true"
            className="hidden h-6 w-px bg-surface-3 xl:block"
          />
        )}

        {/* stats — xl+ */}
        {hasStats && (
          <div className="hidden items-center gap-3 xl:flex">
            {profileData.stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div aria-hidden="true" className="h-4 w-px bg-surface-3" />
                )}
                <div className="text-center">
                  <p className="text-[13px] font-bold leading-none text-text-primary">
                    {s.value}
                  </p>
                  <p className="mt-[3px] text-[9px] font-semibold uppercase tracking-wide leading-none text-text-tertiary">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-text-tertiary transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {/* ── Dropdown panel ─────────────────────────────── */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-100 mt-2 w-60 overflow-hidden rounded-2xl border border-(--color-border) bg-surface-0 animate-[dropdown-enter_150ms_ease-out_forwards]"
          style={{
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.1),0 0 0 1px var(--color-border)",
          }}
        >
          {/* identity block */}
          <div className="border-b border-(--color-border) px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg,var(--portal-accent) 0%,var(--portal-accent-hover) 100%)",
                  boxShadow:
                    "0 2px 8px color-mix(in srgb,var(--portal-accent) 35%,transparent)",
                }}
              >
                {profileData.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {profileData.name}
                </p>
                <p className="truncate text-xs text-text-tertiary">
                  {profileData.role}
                </p>
              </div>
            </div>
            {portalMeta?.name && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="rounded-md px-1.5 py-0.75 text-2xs font-semibold"
                  style={{
                    background: "var(--portal-accent-subtle)",
                    color: "var(--portal-accent)",
                  }}
                >
                  {portalMeta.name} Portal
                </span>
                <span className="text-2xs text-text-tertiary">
                  {portalMeta.tagline}
                </span>
              </div>
            )}
          </div>

          {/* menu items */}
          <div className="p-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors duration-100 hover:bg-surface-2 hover:text-text-primary"
              >
                <item.icon
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-text-tertiary"
                />
                {item.label}
              </Link>
            ))}
          </div>

          {/* sign out */}
          <div className="border-t border-(--color-border) p-1.5">
            <button
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-error transition-colors duration-100 hover:bg-error-subtle"
            >
              <LogOut aria-hidden="true" className="size-3.5 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
