export const portalMeta = {
  name: "Flow",
  tagline: "Automation Hub",
};

export const sidebarData = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/home" },
      { label: "My Flows", icon: "GitBranch", href: "/flows" },
      {
        label: "Builder",
        icon: "Workflow",
        href: "/builder",
        children: [
          { label: "New Flow", href: "/builder/new" },
          { label: "Templates", href: "/builder/templates" },
        ],
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Connections", icon: "Plug", href: "/connections" },
      {
        label: "Webhooks",
        icon: "Zap",
        href: "/webhooks",
        badge: { text: "2 failed", variant: "danger" },
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", icon: "BarChart2", href: "/reports" },
      {
        label: "Activity Logs",
        icon: "Activity",
        href: "/logs",
        children: [
          { label: "Success Logs", href: "/logs/success" },
          { label: "Error Logs", href: "/logs/error" },
          { label: "Audit Trail", href: "/logs/audit" },
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
  name: "Ethan Park",
  role: "DevOps Engineer",
  initials: "EP",
  isOnline: true,
  stats: [
    { value: "99.9%", label: "uptime" },
    { value: "24", label: "flows" },
  ],
};

export const progressData = {
  label: "System Health",
  percent: 99,
  subtitle: "All systems operational",
  detail: "Last incident: 14 days ago",
};

export const pageLabels = {
  "/home": "Dashboard",
  "/flows": "My Flows",
  "/builder": "Flow Builder",
  "/builder/new": "New Flow",
  "/builder/templates": "Templates",
  "/connections": "Connections",
  "/webhooks": "Webhooks",
  "/reports": "Reports",
  "/logs": "Activity Logs",
  "/logs/success": "Success Logs",
  "/logs/error": "Error Logs",
  "/logs/audit": "Audit Trail",
  "/settings": "Settings",
  "/profile": "Profile",
};
