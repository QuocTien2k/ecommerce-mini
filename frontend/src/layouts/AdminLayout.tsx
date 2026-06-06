import Navbar from "@components/layout/Navbar";
import Sidebar from "@components/layout/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar - Truyền collapsed và onToggle vào */}
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        {/* Content */}
        <main className="relative flex-1 p-6 overflow-y-auto">
          <div className="relative min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
