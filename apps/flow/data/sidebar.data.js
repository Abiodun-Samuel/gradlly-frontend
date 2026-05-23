export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
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
      { label: "Webhooks", icon: "Zap", href: "/webhooks" },
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
    items: [{ label: "Profile", icon: "User", href: "/profile" }],
  },
];

export const UTILITY_LINKS = [
  { label: "Help & Docs", icon: "HelpCircle", href: "/help" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];
