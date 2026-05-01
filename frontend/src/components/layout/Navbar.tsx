import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { AsyncButton } from "@components/common/async-button";
import { authApi } from "@features/auth/auth.api";
import { clearAuth } from "@features/auth/auth.slice";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { loading, run } = useScopedLoading();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    console.log("User from Redux:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await run(async () => {
        await authApi.logout(); //xóa refreshToken
      });
    } finally {
      dispatch(clearAuth());
      localStorage.removeItem("hasAuthHint");
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Admin Panel</h1>

      <AsyncButton
        loading={loading}
        variant="destructive"
        type="submit"
        className="px-6 py-5"
        loadingText="Đang thoát"
        onClick={handleLogout}
      >
        Đăng xuất
      </AsyncButton>
    </header>
  );
};

export default Navbar;
