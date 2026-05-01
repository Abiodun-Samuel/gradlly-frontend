import { StatCard } from "@gradlly/ui";
import {
  Briefcase,
  Users,
  Send,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock4,
} from "lucide-react";

const stats = [
  {
    label: "Open Positions",
    value: "57",
    hint: "Across all regions",
    trendLabel: "3 posted this week",
    trend: "up",
    icon: Briefcase,
  },
  {
    label: "New Applications",
    value: "12",
    hint: "Awaiting review",
    trendLabel: "Up 40% from last week",
    trend: "up",
    icon: Users,
  },
  {
    label: "Offers Pending",
    value: "23",
    hint: "Awaiting response",
    trendLabel: "5 expiring this week",
    trend: "down",
    icon: Send,
  },
  {
    label: "Interviews Booked",
    value: "8",
    hint: "This week",
    trendLabel: "Next: tomorrow 10am",
    trend: "flat",
    icon: Calendar,
  },
];

const recentActivity = [
  {
    id: 1,
    type: "success",
    title: "Offer accepted",
    desc: "Sarah Mitchell accepted the Frontend Developer offer.",
    time: "1h ago",
  },
  {
    id: 2,
    type: "info",
    title: "12 new applications",
    desc: "12 candidates applied for the Software Engineer (Apprentice) role.",
    time: "2h ago",
  },
  {
    id: 3,
    type: "warning",
    title: "5 offers expiring soon",
    desc: "5 pending offers will expire by end of the week. Review and follow up.",
    time: "4h ago",
  },
  {
    id: 4,
    type: "success",
    title: "Onboarding completed",
    desc: "Alex Johnson has completed all onboarding tasks for their first week.",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "info",
    title: "Interview feedback added",
    desc: "Panel feedback for the Product Designer role has been submitted.",
    time: "2d ago",
  },
];

const activityIcons = {
  success: { Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
  warning: { Icon: AlertCircle, cls: "text-amber-500 bg-amber-50" },
  info: { Icon: Clock4, cls: "text-sky-500 bg-sky-50" },
};

const pipeline = [
  { label: "Senior Developer", stage: "Shortlisting", count: 24 },
  { label: "Product Designer", stage: "Interview", count: 6 },
  { label: "DevOps Engineer", stage: "Offer", count: 2 },
  { label: "Apprentice (Frontend)", stage: "Screening", count: 38 },
];

export default function EmployerHomePage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Welcome back, James 👋
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Here&apos;s your hiring pipeline and team activity for today.
          </p>
        </div>
        <p className="text-sm text-text-tertiary">{today}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-(--color-border) bg-surface-0 shadow-xs">
          <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Recent Activity
            </h3>
            <button
              className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--portal-accent)" }}
            >
              View all <ArrowRight className="size-3" />
            </button>
          </div>
          <div className="divide-y divide-(--color-border)">
            {recentActivity.map((item) => {
              const { Icon, cls } = activityIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 px-5 py-3.5 transition-colors hover:bg-surface-1"
                >
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${cls}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {item.desc}
                    </p>
                  </div>
                  <time className="shrink-0 text-2xs text-text-tertiary">
                    {item.time}
                  </time>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-surface-0 shadow-xs">
          <div className="border-b border-(--color-border) px-5 py-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Active Pipeline
            </h3>
          </div>
          <div className="divide-y divide-(--color-border)">
            {pipeline.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-2xs text-text-tertiary">
                    {item.stage}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-2xs font-bold text-white"
                  style={{ background: "var(--portal-accent)" }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
          <div
            className="m-4 rounded-xl p-4"
            style={{ background: "var(--portal-accent-subtle)" }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--portal-accent)" }}
            >
              Hiring Health
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "var(--portal-accent)" }}
            >
              Good
            </p>
            <p
              className="mt-1 text-2xs"
              style={{ color: "var(--portal-accent)" }}
            >
              57 open roles · 70 active candidates · Avg time-to-hire 18 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
