import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package } from "lucide-react";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/users",
    label: "Quản lý người dùng",
    icon: Users,
  },
  {
    to: "/admin/products",
    label: "Quản lý sản phẩm",
    icon: Package,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen p-4 text-white bg-linear-to-b from-neutral-900 via-neutral-950 to-black border-r border-white/10">
      <h2 className="text-lg font-semibold mb-6 text-white/90">Admin Panel</h2>

      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/5 text-white border-l-2 border-blue-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-blue-400" : "text-white/60"}
                  />
                  <span className="text-sm">{item.label}</span>
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
