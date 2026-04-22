import { useAppDispatch } from "@app/hooks";
import { clearAuth } from "@features/auth/auth.slice";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Admin Panel</h1>

      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
