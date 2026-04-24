import { useAppDispatch } from "@app/hooks";
import { authApi } from "@features/auth/auth.api";
import { clearAuth } from "@features/auth/auth.slice";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await authApi.logout(); // xóa refresh token ở server
    } finally {
      dispatch(clearAuth());
    }
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
