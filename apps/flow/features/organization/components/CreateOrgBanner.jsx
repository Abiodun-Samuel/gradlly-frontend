"use client";

import { Building2, Sparkles, X } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { AnimatePresence, MotionBox } from "@/components/ui/MotionBox";
import { cn } from "@/utils/helper";

/**
 * CreateOrgBanner
 *
 * A modern banner prompting the user to create their organisation. Shown in the
 * dashboard when the authenticated user has no active organisation.
 *
 * The close button smoothly collapses and hides the banner (height + opacity),
 * letting the content below slide up gracefully.
 *
 * @param {object}   props
 * @param {Function} props.onCreate   called when the user clicks "Create organisation"
 * @param {string}   [props.className]
 */
export function CreateOrgBanner({ onCreate, className }) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible ? (
        <MotionBox
          key="create-org-banner"
          // Animate height + opacity so the banner collapses smoothly and the
          // content beneath rises to fill the space. overflow-hidden keeps the
          // rounded corners clean during the height transition.
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          duration={0.32}
          exitDuration={0.28}
          className={cn("overflow-hidden", className)}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-primary-200 shadow-sm"
            style={{
              background:
                "linear-gradient(120deg, #f1f7f3 0%, #ffffff 45%, #f1f7f3 100%)",
            }}
          >
            {/* Decorative accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary-200/40 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-primary-500 to-primary-700"
            />

            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Dismiss"
              className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="size-4" aria-hidden />
            </button>

            <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-sm ring-1 ring-primary-700/10">
                <Building2 className="size-6" strokeWidth={1.75} aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-700">
                    <Sparkles className="size-3" aria-hidden />
                    Get started
                  </span>
                </div>
                <h2 className="text-base font-bold tracking-tight text-neutral-900 sm:text-lg">
                  Set up your organisation
                </h2>
                <p className="mt-0.5 max-w-xl text-sm leading-relaxed text-neutral-600">
                  Create your organisation to unlock your dashboard, invite team
                  members, and connect everything in one place.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  color="green"
                  size="md"
                  onClick={onCreate}
                  startIcon={<Building2 className="size-4" />}
                  className="w-full sm:w-auto"
                >
                  Create organisation
                </Button>
              </div>
            </div>
          </div>
        </MotionBox>
      ) : null}
    </AnimatePresence>
  );
}
