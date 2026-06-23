"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { useOrgSwitcher } from "@/features/auth/hooks/useOrgSwitcher";
import { capitalise, cn } from "@/utils/helper";

// ─── Theme tokens ───────────────────────────────────────────────────────────
// One component, two surfaces: the dark sidebar and the light user-menu. Tokens
// keep the markup identical so behaviour can never drift between the two.
const THEMES = {
  sidebar: {
    trigger:
      "text-white/55 hover:bg-white/6 hover:text-white/85 focus-visible:outline-primary-300",
    triggerName: "text-white",
    triggerMeta: "text-white/45",
    chevron: "text-white/30",
    list: "border-white/8 bg-black/15",
    itemBase: "text-white/65 hover:bg-white/6",
    itemActive: "bg-primary-400/14 text-white",
    itemName: "text-white",
    itemMeta: "text-white/40",
    check: "text-primary-400",
  },
  menu: {
    trigger:
      "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-primary-400",
    triggerName: "text-neutral-900",
    triggerMeta: "text-neutral-500",
    chevron: "text-neutral-400",
    list: "border-neutral-200 bg-neutral-50/60",
    itemBase: "text-neutral-700 hover:bg-white",
    itemActive: "bg-white text-neutral-900 shadow-sm",
    itemName: "text-neutral-900",
    itemMeta: "text-neutral-500",
    check: "text-primary-600",
  },
};

function OrgRow({ org, isActive, isSwitching, theme, onSelect }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isActive}
      disabled={isSwitching}
      onClick={() => onSelect(org.id)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-100",
        "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-400",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isActive ? theme.itemActive : theme.itemBase,
      )}
    >
      <Avatar
        initials={org.name?.[0]?.toUpperCase() ?? "?"}
        alt={`${org.name} logo`}
        size="xs"
        shape="square"
        className="shrink-0"
      />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[12px] font-semibold",
            theme.itemName,
          )}
        >
          {org.name}
        </span>
        <span
          className={cn(
            "block truncate text-[10px] font-medium",
            theme.itemMeta,
          )}
        >
          {capitalise(org.portalType)} portal
        </span>
      </span>
      {isSwitching ? (
        <Loader2
          aria-hidden
          className={cn("size-3.5 shrink-0 animate-spin", theme.check)}
        />
      ) : isActive ? (
        <Check aria-hidden className={cn("size-3.5 shrink-0", theme.check)} />
      ) : null}
    </button>
  );
}

/**
 * Organisation switcher.
 *
 * Renders nothing unless the user belongs to more than one organisation on this
 * portal. Selecting an org writes the active-org cookie and refetches the
 * session (see useOrgSwitcher), so the whole dashboard re-renders under the new
 * org without a full reload or any cross-portal navigation.
 *
 * The list expands inline (grid-rows transition) rather than as a popover, so it
 * is never clipped by the `overflow-hidden` sidebar / user-menu containers and
 * stays fully responsive on every viewport.
 *
 * @param {"sidebar"|"menu"} variant
 */
export function OrgSwitcher({ variant = "sidebar" }) {
  const {
    organisations,
    activeOrgId,
    canSwitchOrganisation,
    switchingTo,
    isSwitching,
    switchOrganisation,
  } = useOrgSwitcher();

  const [open, setOpen] = useState(false);
  const theme = THEMES[variant] ?? THEMES.sidebar;

  // Single-org users have nothing to switch to — keep the UI clean.
  if (!canSwitchOrganisation) return null;

  const active = organisations.find((o) => o.id === activeOrgId);

  async function onSelect(nextId) {
    setOpen(false);
    await switchOrganisation(nextId);
  }

  return (
    <div className="px-3 pb-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="org-switcher-list"
        aria-label="Switch organisation"
        disabled={isSwitching}
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-70",
          theme.trigger,
        )}
      >
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[12px] font-semibold",
              theme.triggerName,
            )}
          >
            {active?.name ?? "Select organisation"}
          </span>
          <span
            className={cn(
              "block truncate text-[10px] font-medium",
              theme.triggerMeta,
            )}
          >
            {active
              ? `${capitalise(active.portalType)} portal`
              : "Switch organisation"}
          </span>
        </span>
        {isSwitching ? (
          <Loader2
            aria-hidden
            className={cn("size-3.5 shrink-0 animate-spin", theme.chevron)}
          />
        ) : (
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              theme.chevron,
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Inline expanding list — grid-rows trick animates height with no clipping. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            id="org-switcher-list"
            role="menu"
            aria-label="Your organisations"
            className={cn(
              "mt-1 max-h-64 space-y-0.5 overflow-y-auto rounded-xl border p-1",
              theme.list,
            )}
          >
            {organisations.map((org) => (
              <OrgRow
                key={org.id}
                org={org}
                theme={theme}
                isActive={org.id === activeOrgId}
                isSwitching={switchingTo === org.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
