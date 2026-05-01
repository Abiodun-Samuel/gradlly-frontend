import { StatCard } from "@gradlly/ui";
import {
  BookOpen,
  Users,
  BarChart3,
  Flag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock4,
} from "lucide-react";

const stats = [
  {
    label: "Live Courses",
    value: "219",
    hint: "Across all domains",
    trendLabel: "4 published this month",
    trend: "up",
    icon: BookOpen,
  },
  {
    label: "Active Learners",
    value: "1,842",
    hint: "Enrolled learners",
    trendLabel: "Up 12% this quarter",
    trend: "up",
    icon: Users,
  },
  {
    label: "Avg Completion",
    value: "91%",
    hint: "All active courses",
    trendLabel: "Best-in-cohort benchmark",
    trend: "up",
    icon: BarChart3,
  },
  {
    label: "Audits Pending",
    value: "11",
    hint: "Action needed",
    trendLabel: "3 high priority",
    trend: "down",
    icon: Flag,
  },
];

const recentActivity = [
  {
    id: 1,
    type: "warning",
    title: "11 assessments pending",
    desc: "Learner assessments across 4 courses are awaiting grading.",
    time: "1h ago",
  },
  {
    id: 2,
    type: "success",
    title: "Course published",
    desc: '"Advanced TypeScript for Professionals" is now live with 34 learners.',
    time: "3h ago",
  },
  {
    id: 3,
    type: "info",
    title: "New learner enrolled",
    desc: "Priya Sharma enrolled in Full-Stack Web Development (Level 4).",
    time: "5h ago",
  },
  {
    id: 4,
    type: "success",
    title: "Audit report submitted",
    desc: "The Ofsted self-assessment report for Level 3 Digital has been submitted.",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "warning",
    title: "Course content expiring",
    desc: "Module 3 of Cloud Architecture has outdated material flagged for update.",
    time: "2d ago",
  },
];

const activityIcons = {
  success: { Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
  warning: { Icon: AlertCircle, cls: "text-amber-500 bg-amber-50" },
  info: { Icon: Clock4, cls: "text-sky-500 bg-sky-50" },
};

const topCourses = [
  { name: "Full-Stack Web Dev", enrolled: 342, completion: "89%" },
  { name: "Data Science Fundamentals", enrolled: 287, completion: "94%" },
  { name: "Cloud Architecture", enrolled: 198, completion: "76%" },
  { name: "DevOps Engineering", enrolled: 156, completion: "92%" },
];

export default function ProviderHomePage() {
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
            Welcome back, Sarah 👋
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Your platform is performing well — 91% average completion rate
            across all courses.
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
              Top Courses
            </h3>
          </div>
          <div className="divide-y divide-(--color-border)">
            {topCourses.map((course) => (
              <div key={course.name} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {course.name}
                  </p>
                  <span
                    className="shrink-0 text-xs font-bold"
                    style={{ color: "var(--portal-accent)" }}
                  >
                    {course.completion}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: course.completion,
                        background: "var(--portal-accent)",
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-2xs text-text-tertiary">
                    {course.enrolled} learners
                  </span>
                </div>
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
              Platform Quality Score
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "var(--portal-accent)" }}
            >
              4.8 / 5
            </p>
            <p
              className="mt-1 text-2xs"
              style={{ color: "var(--portal-accent)" }}
            >
              Based on last 30 days · 219 courses · 1,842 learners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
