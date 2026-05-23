export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
      { label: "Cohort", icon: "Users", href: "/cohort" },
      { label: "At-Risk Queue", icon: "AlertTriangle", href: "/at-risk" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Ofsted Hub", icon: "ShieldCheck", href: "/ofsted-hub" },
      { label: "QIP", icon: "ClipboardCheck", href: "/qip" },
      { label: "ILR & DAS", icon: "FileText", href: "/ilr-das" },
      { label: "Evidence Vault", icon: "FolderLock", href: "/evidence-vault" },
    ],
  },
  {
    title: "Delivery",
    items: [
      { label: "Reviews", icon: "CalendarCheck", href: "/reviews" },
      { label: "Tutors", icon: "GraduationCap", href: "/tutors" },
      { label: "Employers", icon: "Building2", href: "/employers" },
      {
        label: "Commitment Statements",
        icon: "FileSignature",
        href: "/commitment-statements",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", icon: "BarChart3", href: "/reports" },
      { label: "KSB Coverage", icon: "BookOpen", href: "/ksb-coverage" },
    ],
  },
];

export const UTILITY_LINKS = [
  { label: "Help & Docs", icon: "HelpCircle", href: "/help" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];
