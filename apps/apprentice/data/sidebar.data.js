export const NAV_SECTIONS = [
  {
    title: "My Learning",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
      {
        label: "My Courses",
        icon: "BookOpen",
        href: "/courses",
        children: [
          { label: "Live", href: "/courses/live" },
          { label: "Drafts", href: "/courses/drafts" },
          { label: "Archived", href: "/courses/archived" },
        ],
      },
      { label: "Assessments", icon: "ClipboardList", href: "/assessments" },
      { label: "Progress", icon: "TrendingUp", href: "/progress" },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { label: "Curriculum", icon: "BookMarked", href: "/curriculum" },
      { label: "Analytics", icon: "BarChart2", href: "/analytics" },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        label: "Reports",
        icon: "FileText",
        href: "/reports",
        children: [
          { label: "Completion", href: "/reports/completion" },
          { label: "Engagement", href: "/reports/engagement" },
        ],
      },
      { label: "Learners", icon: "Users", href: "/learners" },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", icon: "User", href: "/profile" }],
  },
];

export const UTILITY_LINKS = [
  { label: "Help & Docs", icon: "HelpCircle", href: "/help" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];
