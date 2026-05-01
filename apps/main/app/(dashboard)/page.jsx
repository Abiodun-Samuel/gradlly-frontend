import { StatCard } from "@gradlly/ui";
import {
  Clock,
  MessageSquare,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock4,
} from "lucide-react";

const stats = [
  {
    label: "Programme Progress",
    value: "68%",
    hint: "Month 8 of 24",
    trendLabel: "On track",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "OTJ Hours Logged",
    value: "142h",
    hint: "Target: 146h",
    trendLabel: "4h behind target",
    trend: "down",
    icon: Clock,
  },
  {
    label: "Modules Complete",
    value: "14 / 24",
    hint: "58% of total",
    trendLabel: "2 completed this month",
    trend: "up",
    icon: Trophy,
  },
  {
    label: "Unread Messages",
    value: "3",
    hint: "2 require action",
    trendLabel: "Last message 1h ago",
    trend: "flat",
    icon: MessageSquare,
  },
];

const recentActivity = [
  {
    id: 1,
    type: "success",
    title: "Q3 Milestone approved",
    desc: "Your employer reviewed and approved your Q3 milestone submission.",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "warning",
    title: "OTJ hours falling behind",
    desc: "You are currently 4 hours behind your monthly off-the-job training target.",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "info",
    title: "New message from employer",
    desc: "Your employer sent a new message regarding your upcoming review.",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "success",
    title: "Module 14 completed",
    desc: 'You successfully completed the "Advanced TypeScript Patterns" module.',
    time: "Yesterday",
  },
  {
    id: 5,
    type: "info",
    title: "Portfolio updated",
    desc: "2 new portfolio items were added to your profile by your training provider.",
    time: "2 days ago",
  },
];

const activityIcons = {
  success: { Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
  warning: { Icon: AlertCircle, cls: "text-amber-500  bg-amber-50" },
  info: { Icon: Clock4, cls: "text-sky-500    bg-sky-50" },
};

const upcomingItems = [
  { label: "Mid-programme review", date: "15 May", status: "upcoming" },
  { label: "OTJ log submission", date: "31 May", status: "due" },
  { label: "Portfolio review", date: "5 Jun", status: "upcoming" },
  { label: "Module 15 assessment", date: "12 Jun", status: "upcoming" },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Welcome back, Alex 👋
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Here&apos;s what&apos;s happening with your apprenticeship today.
          </p>
        </div>
        <p className="text-sm text-text-tertiary">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent activity */}
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

        {/* Upcoming */}
        <div className="rounded-2xl border border-(--color-border) bg-surface-0 shadow-xs">
          <div className="border-b border-(--color-border) px-5 py-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Upcoming
            </h3>
          </div>
          <div className="divide-y divide-(--color-border)">
            {upcomingItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-2xs text-text-tertiary">
                    {item.date}
                  </p>
                </div>
                <span
                  className={
                    item.status === "due"
                      ? "shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-2xs font-semibold text-amber-700"
                      : "shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-2xs font-semibold text-text-secondary"
                  }
                >
                  {item.status === "due" ? "Due soon" : "Upcoming"}
                </span>
              </div>
            ))}
          </div>

          {/* Progress summary */}
          <div
            className="m-4 rounded-xl p-4"
            style={{ background: "var(--portal-accent-subtle)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--portal-accent)" }}
              >
                Programme Progress
              </p>
              <span
                className="text-xs font-bold"
                style={{ color: "var(--portal-accent)" }}
              >
                68%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "68%", background: "var(--portal-accent)" }}
              />
            </div>
            <p
              className="mt-2 text-2xs"
              style={{ color: "var(--portal-accent)" }}
            >
              Month 8 of 24 · On track · 14 modules done
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
