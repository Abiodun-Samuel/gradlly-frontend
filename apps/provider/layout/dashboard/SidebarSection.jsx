import { SidebarItem } from "./SidebarItem";
export function SidebarSection({ section }) {
  return (
    <div className="space-y-0.5">
      <p
        className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-[0.09em]"
        style={{ color: "rgba(255,255,255,0.26)" }}
      >
        {section.title}
      </p>
      {section.items.map((item) => (
        <SidebarItem key={item.href} item={item} />
      ))}
    </div>
  );
}
