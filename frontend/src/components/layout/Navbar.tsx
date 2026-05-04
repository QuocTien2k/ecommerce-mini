import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { AsyncButton } from "@components/common/async-button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { authApi } from "@features/auth/auth.api";
import { clearAuth } from "@features/auth/auth.slice";
import { clearUser } from "@features/user/store/user.slice";
import { Power } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, run } = useScopedLoading();
  const user = useAppSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      await run(async () => {
        await authApi.logout(); //xóa refreshToken
      });
    } finally {
      dispatch(clearAuth());
      dispatch(clearUser());
      localStorage.removeItem("hasAuthHint");
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Admin Panel</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatar || "/avatar_admin.jpg"}
                  alt={user?.fullname}
                />
                <AvatarFallback>
                  {user?.fullname?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm text-gray-600">
                Xin chào,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.fullname}
                </span>
              </span>
            </div>
          </DropdownMenuTrigger>

          {/* Content */}
          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-xl shadow-lg border bg-white animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenuItem
              onClick={() => setOpenProfile(true)}
              className="px-4 py-3 text-[15px] rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              Xem thông tin
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem
              asChild
              onSelect={(e) => e.preventDefault()}
              className="p-0 hover:bg-transparent focus:bg-transparent"
            >
              <AsyncButton
                loading={loading}
                onClick={handleLogout}
                variant="destructive"
                loadingText="Đang thoát..."
                className="w-full flex items-center justify-center px-4 py-2 cursor-pointer focus-visible:ring-1 focus-visible:ring-red-300"
              >
                <Power className="w-4 h-4 shrink-0" />
                <span>Đăng xuất</span>
              </AsyncButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal Profile */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold">
              Thông tin tài khoản
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-semibold text-gray-600">
                Họ tên
              </span>
              <span className="col-span-2 text-sm text-gray-900">
                {user?.fullname}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-semibold text-gray-600">Email</span>
              <span className="col-span-2 text-sm text-gray-900">
                {user?.email}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-semibold text-gray-600">phone</span>
              <span className="col-span-2 text-sm text-gray-900">
                {user?.phone}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-semibold text-gray-600">
                address
              </span>
              <span className="col-span-2 text-sm text-gray-900">
                {user?.address}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
