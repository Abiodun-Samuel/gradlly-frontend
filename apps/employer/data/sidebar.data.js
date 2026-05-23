export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
      {
        label: "Analytics",
        icon: "BarChart2",
        href: "/analytics",
        children: [
          { label: "Hiring Funnel", href: "/analytics/hiring" },
          { label: "Team Performance", href: "/analytics/performance" },
          { label: "Cost Reports", href: "/analytics/cost" },
        ],
      },
    ],
  },
  {
    title: "Talent",
    items: [
      { label: "Apprentices", icon: "Users", href: "/apprentices" },
      { label: "Job Posts", icon: "Briefcase", href: "/jobs" },
      {
        label: "Applications",
        icon: "ClipboardList",
        href: "/applications",
        children: [
          { label: "Under Review", href: "/applications/review" },
          { label: "Shortlisted", href: "/applications/shortlisted" },
          { label: "Rejected", href: "/applications/rejected" },
        ],
      },
      { label: "Onboarding", icon: "UserPlus", href: "/onboarding" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing", icon: "CreditCard", href: "/billing" },
      { label: "Profile", icon: "User", href: "/profile" },
    ],
  },
];

export const UTILITY_LINKS = [
  { label: "Help & Docs", icon: "HelpCircle", href: "/help" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];
