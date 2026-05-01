export const portalMeta = {
  name: "Provider",
  tagline: "Course Hub",
};

export const sidebarData = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/home" },
      { label: "Analytics", icon: "BarChart3", href: "/analytics" },
    ],
  },
  {
    title: "Programme",
    items: [
      {
        label: "Courses",
        icon: "BookOpen",
        href: "/courses",
        children: [
          { label: "Live Courses", href: "/courses/live" },
          { label: "Drafts", href: "/courses/drafts" },
          { label: "Archived", href: "/courses/archived" },
        ],
      },
      { label: "Curriculum", icon: "BookMarked", href: "/curriculum" },
      {
        label: "Assessments",
        icon: "ClipboardList",
        href: "/assessments",
        badge: { text: "11 pending", variant: "warning" },
      },
    ],
  },
  {
    title: "Learners",
    items: [
      { label: "All Learners", icon: "Users", href: "/learners" },
      { label: "Progress", icon: "TrendingUp", href: "/progress" },
      {
        label: "Reports",
        icon: "FileText",
        href: "/reports",
        children: [
          { label: "Completion", href: "/reports/completion" },
          { label: "Engagement", href: "/reports/engagement" },
        ],
      },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", icon: "Settings", href: "/settings" }],
  },
];

export const profileData = {
  name: "Sarah Williams",
  role: "Course Director",
  initials: "SW",
  isOnline: true,
  stats: [
    { value: "47", label: "learners" },
    { value: "11", label: "courses" },
  ],
};

export const progressData = {
  label: "Delivery Progress",
  percent: 72,
  subtitle: "Q2 cohort · 8 of 11 courses",
  detail: "On schedule · 2 pending review",
};

export const pageLabels = {
  "/home": "Dashboard",
  "/analytics": "Analytics",
  "/courses": "Courses",
  "/courses/live": "Live Courses",
  "/courses/drafts": "Drafts",
  "/courses/archived": "Archived",
  "/curriculum": "Curriculum",
  "/assessments": "Assessments",
  "/learners": "All Learners",
  "/progress": "Progress",
  "/reports": "Reports",
  "/reports/completion": "Completion Report",
  "/reports/engagement": "Engagement Report",
  "/settings": "Settings",
  "/profile": "Profile",
};
