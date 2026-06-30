import { Calendar, Download, Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export function OTJHeader({ data, onLogSession }) {
  const { today, apprentice, hours } = data;

  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
        <Calendar size={11} />
        {today.date} · Week {today.week} of your programme
      </span>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Off-the-job training
            </h1>
            <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full whitespace-nowrap">
              {apprentice.standard} · min {hours.minimum}h
            </span>
          </div>
          <p className="mt-1.5 text-sm text-neutral-500 max-w-xl leading-relaxed">
            Training during paid hours that builds the knowledge, skills &amp;
            behaviours required by your apprenticeship standard.
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {apprentice.name} · {apprentice.role} · {apprentice.college}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            startIcon={<Download size={14} />}
          >
            Export report
          </Button>
          <Button
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={onLogSession}
          >
            Log a session
          </Button>
        </div>
      </div>
    </div>
  );
}
