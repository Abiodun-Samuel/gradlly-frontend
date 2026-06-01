import { T } from "@/components/dashboard/levy/tokens";

export const KPI = [
  {
    value: "£2.1k",
    label: "Levy ROI",
    sub: "Saved per hire vs agency",
    accent: () => T.green,
    method:
      "Agency fee benchmark (£4,200) minus avg training cost per hire (£2,100). Based on 4 completions this FY.",
  },
  {
    value: "87%",
    label: "Completion rate",
    sub: "Historic cohort completions",
    accent: () => T.blue,
    method:
      "Apprentices who achieved EPA ÷ total starters in same cohort. FY 2023/24: 8 starters, 7 completions.",
  },
  {
    value: "92%",
    label: "EPA pass rate",
    sub: "First-attempt passes",
    accent: () => T.green,
    method:
      "11 of 12 first-attempt EPA submissions passed. National average: 68%. Source: ESFA outcomes 2024.",
  },
  {
    value: "78%",
    label: "Retention (post-EPA)",
    sub: "Still employed at 12 months",
    accent: () => T.amber,
    method:
      "7 of 9 completions still at Midlands Engineering 12 months post-EPA. National average: 71%.",
  },
];

export const REPORTS = [
  {
    id: "r1",
    icon: "📊",
    badge: "PDF",
    title: "Levy utilisation report",
    sub: "FY 2024/25 · Last generated today",
    lastGenerated: "Today, 09:41",
    includes: [
      "Available levy balance (live from DAS)",
      "Monthly contributions — last 12 months",
      "Utilisation breakdown",
      "12-month spend forecast",
      "Expiry schedule — next 24 months",
    ],
  },
  {
    id: "r2",
    icon: "👥",
    badge: "CSV",
    title: "Apprentice progress summary",
    sub: "All active · March 2025",
    lastGenerated: "28 Mar 2025",
    includes: [
      "OTJ hours per learner",
      "Milestone completion rates",
      "EPA readiness scores",
      "At-risk flags",
    ],
  },
  {
    id: "r3",
    icon: "⚠️",
    badge: "Live",
    title: "At-risk intervention report",
    sub: "2 flagged · Updated weekly",
    lastGenerated: "Mon 01 Apr 2025",
    includes: [
      "Learners below OTJ threshold",
      "Missing milestone check-ins",
      "Last contact date",
      "Recommended interventions",
    ],
  },
  {
    id: "r4",
    icon: "🏫",
    badge: "PDF",
    title: "Provider performance",
    sub: "3 providers benchmarked",
    lastGenerated: "25 Mar 2025",
    includes: [
      "OTJ delivery rates",
      "EPA outcomes",
      "Compliance scores",
      "Trend vs previous period",
    ],
  },
  {
    id: "r5",
    icon: "📅",
    badge: "Scheduled",
    title: "EPA forecast report",
    sub: "Next 12 months · Auto-generated",
    lastGenerated: "Auto: 1st of month",
    includes: [
      "Predicted EPA dates",
      "Readiness scores",
      "Preparation timeline",
      "Risk flags for next 90 days",
    ],
  },
  {
    id: "r6",
    icon: "✅",
    badge: "PDF",
    title: "ESFA compliance report",
    sub: "All commitments · OTJ compliance",
    lastGenerated: "20 Mar 2025",
    includes: [
      "Commitment statement status",
      "OTJ compliance per learner",
      "Provider submission compliance",
      "Audit risk flags",
    ],
  },
];

export const PROVIDERS = [
  {
    name: "Birmingham Met",
    pct: 78,
    learners: 3,
    trend: "+4%",
    belowThreshold: false,
  },
  {
    name: "Aston Training",
    pct: 42,
    learners: 2,
    trend: "-3%",
    belowThreshold: true,
  },
  {
    name: "WMG Academy",
    pct: 44,
    learners: 3,
    trend: "+1%",
    belowThreshold: true,
  },
];

export const HISTORY = [
  {
    id: "h1",
    title: "Levy utilisation report",
    date: "01 Mar 2025",
    format: "PDF",
    size: "1.2 MB",
  },
  {
    id: "h2",
    title: "Apprentice progress summary",
    date: "01 Mar 2025",
    format: "CSV",
    size: "48 KB",
  },
  {
    id: "h3",
    title: "Levy utilisation report",
    date: "01 Feb 2025",
    format: "PDF",
    size: "1.1 MB",
  },
  {
    id: "h4",
    title: "Provider performance",
    date: "25 Feb 2025",
    format: "PDF",
    size: "890 KB",
  },
  {
    id: "h5",
    title: "ESFA compliance report",
    date: "01 Feb 2025",
    format: "PDF",
    size: "760 KB",
  },
];

export const REPORT_TYPES = [
  "Levy utilisation",
  "Apprentice progress",
  "Provider performance",
  "EPA forecast",
  "ESFA compliance",
  "At-risk intervention",
];
export const FREQUENCIES = ["Monthly", "Weekly", "Quarterly", "One-time"];
export const OTJ_THRESHOLD = 65;
