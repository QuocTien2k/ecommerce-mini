import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-6">Admin</h2>

      <nav className="flex flex-col gap-2">
        <Link to="/admin" className="hover:bg-gray-100 p-2 rounded">
          Dashboard
        </Link>
        <Link to="/admin/users" className="hover:bg-gray-100 p-2 rounded">
          Users
        </Link>
        <Link to="/admin/products" className="hover:bg-gray-100 p-2 rounded">
          Products
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
