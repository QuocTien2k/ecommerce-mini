import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
  { to: "/admin/products", label: "Quản lý sản phẩm", icon: Package },
];

const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <aside
      className={`min-h-screen bg-linear-to-b from-neutral-900 via-neutral-950 to-black 
                  border-r border-white/10 text-white transition-all duration-500 ease-in-out
                  ${collapsed ? "w-24" : "w-64"} overflow-hidden`}
    >
      {/* Header Sidebar */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        {!collapsed && (
          <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {({ isActive }) => (
                <div
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${collapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-white/10 text-white shadow-inner border-l-2 border-blue-500"
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                >
                  <Icon size={20} className={isActive ? "text-blue-400" : ""} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
