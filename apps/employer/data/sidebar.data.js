export const portalMeta = {
  name: "Employer",
  tagline: "Talent Hub",
};

export const sidebarData = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/home" },
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
        badge: { text: "12 new", variant: "info" },
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
      { label: "Settings", icon: "Settings", href: "/settings" },
      { label: "Billing", icon: "CreditCard", href: "/billing" },
    ],
  },
];

export const profileData = {
  name: "James Roberts",
  role: "HR Manager",
  initials: "JR",
  isOnline: true,
  stats: [
    { value: "12", label: "active" },
    { value: "3", label: "openings" },
  ],
};

export const progressData = {
  label: "Hiring Progress",
  percent: 75,
  subtitle: "9 of 12 positions filled",
  detail: "Q2 target on track",
};

export const pageLabels = {
  "/home": "Dashboard",
  "/analytics": "Analytics",
  "/analytics/hiring": "Hiring Funnel",
  "/analytics/performance": "Team Performance",
  "/analytics/cost": "Cost Reports",
  "/apprentices": "Apprentices",
  "/jobs": "Job Posts",
  "/applications": "Applications",
  "/applications/review": "Under Review",
  "/applications/shortlisted": "Shortlisted",
  "/applications/rejected": "Rejected",
  "/onboarding": "Onboarding",
  "/settings": "Settings",
  "/billing": "Billing",
  "/profile": "Profile",
};
