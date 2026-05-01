export const portalMeta = {
  name: "Main",
  tagline: "Admin Portal",
};

export const sidebarData = [
  {
    title: "Overview",
    items: [
      { label: "Home", icon: "LayoutDashboard", href: "/" },
      { label: "Analytics", icon: "BarChart3", href: "/analytics" },
    ],
  },
  {
    title: "Apprentices",
    items: [
      { label: "All Apprentices", icon: "Users", href: "/apprentices" },
      {
        label: "OTJ Tracker",
        icon: "Timer",
        href: "/otj",
        badge: { text: "4h behind", variant: "warning" },
        children: [
          { label: "Log Hours", href: "/otj/log" },
          { label: "History", href: "/otj/history" },
          { label: "Reports", href: "/otj/reports" },
        ],
      },
      { label: "Milestones", icon: "Flag", href: "/milestones" },
      {
        label: "Portfolio",
        icon: "Folder",
        href: "/portfolio",
        badge: { text: "2 new", variant: "success" },
      },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Agreements", icon: "Sparkles", href: "/agreements" },
      {
        label: "Messages",
        icon: "Mail",
        href: "/messages",
        badge: { text: "3", variant: "info" },
      },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", icon: "Settings", href: "/settings" }],
  },
];

export const profileData = {
  name: "Alex Johnson",
  role: "Software Apprentice",
  initials: "AJ",
  isOnline: true,
  cohort: "Cohort 2024",
  stats: [
    { value: "247", label: "days" },
    { value: "L2", label: "level" },
  ],
};

export const progressData = {
  label: "Programme Progress",
  percent: 68,
  subtitle: "Month 8 of 24",
  detail: "On track · 14 modules done",
};

export const pageLabels = {
  "/": "Home",
  "/analytics": "Analytics",
  "/apprentices": "Apprentices",
  "/otj": "OTJ Tracker",
  "/otj/log": "Log Hours",
  "/otj/history": "OTJ History",
  "/otj/reports": "OTJ Reports",
  "/milestones": "Milestones",
  "/portfolio": "Portfolio",
  "/agreements": "My Agreement",
  "/messages": "Messages",
  "/settings": "Settings",
  "/profile": "Profile",
};
