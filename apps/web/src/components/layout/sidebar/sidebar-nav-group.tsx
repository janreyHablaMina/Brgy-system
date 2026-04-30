import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./sidebar-nav-item";
import type { NavGroup } from "@/config/navigation";

type SidebarNavGroupProps = {
  group: NavGroup;
  collapsed: boolean;
  openMenus: string[];
  onToggleMenu: (label: string) => void;
  onNavigate: () => void;
};

export function SidebarNavGroup({
  group,
  collapsed,
  openMenus,
  onToggleMenu,
  onNavigate,
}: SidebarNavGroupProps) {
  const pathname = usePathname();

  return (
    <section className="mb-5">
      {!collapsed && (
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/40">
          {group.title}
        </p>
      )}

      {collapsed && (
        <div className="mb-2 flex justify-center">
          <span className="h-px w-8 bg-white/10" />
        </div>
      )}

      <nav className="space-y-0.5">
        {group.items.map((item) => {
          const isActive =
            pathname === item.href ||
            item.children?.some((child) => child.href === pathname);

          const isOpen = openMenus.includes(item.label);

          return (
            <SidebarNavItem
              key={item.label}
              item={item}
              isActive={Boolean(isActive)}
              isOpen={isOpen}
              collapsed={collapsed}
              onToggle={() => onToggleMenu(item.label)}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>
    </section>
  );
}
