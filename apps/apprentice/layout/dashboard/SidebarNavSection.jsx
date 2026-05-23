import { SidebarNavItem } from "./SidebarNavItem";

export function SidebarNavSection({ section }) {
  return (
    <div className="mb-1">
      <p
        aria-hidden
        className="px-5 pb-1.5 pt-4 text-[9.5px] font-bold uppercase tracking-[0.13em]"
        style={{ color: "rgba(255,255,255,0.18)" }}
      >
        {section.title}
      </p>
      <div className="px-2">
        {section.items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
