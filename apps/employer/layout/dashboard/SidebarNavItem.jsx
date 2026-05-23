"use client";

import {
  Activity,
  AlertTriangle,
  BarChart2,
  BarChart3,
  BookMarked,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileText,
  FolderLock,
  GitBranch,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plug,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  UserPlus,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
const ICON_MAP = {
  Activity,
  AlertTriangle,
  BarChart2,
  BarChart3,
  BookMarked,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileText,
  FolderLock,
  GitBranch,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plug,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  UserPlus,
  Users,
  Workflow,
  Zap,
};
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/utils/helper";

const ACTIVE_CLASSES =
  "bg-[rgba(94,164,120,0.14)] shadow-[inset_3px_0_0_rgba(94,164,120,0.85)] text-white";

const IDLE_CLASSES = "text-white/50 hover:bg-white/[0.07] hover:text-white/90";

function NavIcon({ name, active }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return (
    <Icon
      aria-hidden
      strokeWidth={active ? 2 : 1.75}
      className={cn(
        "h-4 w-4 shrink-0 transition-colors duration-150",
        active ? "text-white" : "text-white/40 group-hover:text-white/75",
      )}
    />
  );
}

function SubItem({ item }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md py-2.5 pl-11 pr-3.5 text-[13px]",
        "transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-primary-300 focus-visible:-outline-offset-2",
        isActive
          ? "font-semibold " + ACTIVE_CLASSES
          : "font-normal text-white/40 hover:bg-white/[0.07] hover:text-white/75",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
          isActive ? "bg-primary-400" : "bg-white/15",
        )}
      />
      {item.label}
    </Link>
  );
}

export function SidebarNavItem({ item }) {
  const pathname = usePathname();
  const hasChildren = Boolean(item.children?.length);

  const isActive =
    !hasChildren &&
    (pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href)));

  const isGroupActive =
    hasChildren &&
    item.children.some(
      (c) =>
        pathname === c.href || (c.href !== "/" && pathname.startsWith(c.href)),
    );

  const [open, setOpen] = useState(isGroupActive);
  const active = isActive || isGroupActive;

  const rowClasses = cn(
    "group flex w-full items-center gap-3 rounded-md px-3.5 py-3 select-none",
    "transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-primary-300 focus-visible:-outline-offset-2",
    active ? ACTIVE_CLASSES : IDLE_CLASSES,
  );

  const RowContent = (
    <>
      <NavIcon name={item.icon} active={active} />
      <span className="flex-1 truncate text-[13.5px] font-medium leading-none">
        {item.label}
      </span>
      {hasChildren && (
        <ChevronRight
          aria-hidden
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-white/25 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      )}
    </>
  );

  if (hasChildren) {
    return (
      <div>
        <button
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={rowClasses}
        >
          {RowContent}
        </button>
        {open && (
          <div className="pb-1 animate-[fade-in_120ms_ease-out_forwards]">
            {item.children.map((child) => (
              <SubItem key={child.href} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={rowClasses}
    >
      {RowContent}
    </Link>
  );
}
