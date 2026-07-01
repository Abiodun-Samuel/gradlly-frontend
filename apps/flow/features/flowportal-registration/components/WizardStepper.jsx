"use client";

import { Check } from "lucide-react";

import { cn } from "@/utils/helper";

import { STEP_META, WIZARD_STEPS } from "../constants";

// Read-only progress indicator. Position is derived from the server's
// currentStep, never from local state.
export function WizardStepper({ currentStep }) {
  const currentIndex = Math.max(0, WIZARD_STEPS.indexOf(currentStep));

  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1">
      {WIZARD_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step} className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                done && "bg-primary-600 text-white",
                active &&
                  "bg-primary-100 text-primary-700 ring-2 ring-primary-500",
                !done && !active && "bg-neutral-100 text-neutral-400",
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium sm:inline",
                active ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {STEP_META[step]?.label}
            </span>
            {index < WIZARD_STEPS.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "h-px w-6 shrink-0",
                  done ? "bg-primary-400" : "bg-neutral-200",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
