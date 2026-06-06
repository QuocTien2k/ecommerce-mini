import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  BadgeCheck,
  TicketPercent,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
  { to: "/admin/categories", label: "Quản lý danh mục", icon: FolderTree },
  { to: "/admin/brands", label: "Quản lý thương hiệu", icon: BadgeCheck },
  { to: "/admin/products", label: "Quản lý sản phẩm", icon: Package },
  { to: "/admin/vouchers", label: "Quản lý voucher", icon: TicketPercent },
];

const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <aside
      className={`h-screen bg-linear-to-b from-neutral-900 via-neutral-950 to-black 
                  border-r border-white/10 text-white transition-all duration-500 ease-in-out
                  ${collapsed ? "w-24" : "w-64"} overflow-hidden`}
    >
      {/* Header Sidebar */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 overflow-hidden">
        <h2
          className={`text-lg font-semibold tracking-tight whitespace-nowrap
                      transition-all duration-300 ease-in-out
                      ${
                        collapsed
                          ? "opacity-0 -translate-x-2"
                          : "opacity-100 translate-x-0"
                      }`}
        >
          Admin Panel
        </h2>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl
                              transition-all duration-200 group overflow-hidden
                              ${collapsed ? "justify-center" : ""}
                              ${
                                isActive
                                  ? "bg-white/10 text-white shadow-inner border-l-2 border-blue-500"
                                  : "hover:bg-white/5 text-white/70 hover:text-white"
                              }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-blue-400" : ""}`}
                  />

                  <span
                    className={`text-sm whitespace-nowrap transition-all duration-300 ease-in-out
                                ${
                                  collapsed
                                    ? "opacity-0 max-w-0 -translate-x-2"
                                    : "opacity-100 max-w-50 translate-x-0"
                                }`}
                  >
                    {item.label}
                  </span>
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
