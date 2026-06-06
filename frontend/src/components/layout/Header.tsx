import {
  Bell,
  Camera,
  Heart,
  KeyRound,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { clearAuth } from "@features/auth/auth.slice";
import { authApi } from "@features/auth/auth.api";
import { clearUser } from "@features/admin/user/store/user.slice";
import { AsyncButton } from "@components/common/async-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useState } from "react";

const Header = () => {
  //check auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);

  //update
  const [openProfile, setOpenProfile] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, run } = useScopedLoading();
  const handleLogout = async () => {
    try {
      await run(async () => {
        await authApi.logout(); //xóa refreshToken
      });
    } finally {
      dispatch(clearAuth());
      dispatch(clearUser());
      localStorage.removeItem("hasAuthHint");

      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 text-2xl font-bold tracking-tight">
          TechStore
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
          </div>
        </div>

        {/* Right */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="size-5" />

              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                2
              </span>
            </Button>

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.avatar || "/avatar_user.jpg"}
                      alt={user?.fullname}
                    />

                    <AvatarFallback>
                      {user?.fullname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="hidden md:block font-medium">
                    {user?.fullname}
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 p-2">
                <DropdownMenuItem className="px-3 py-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>Cập nhật thông tin</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <span>Cập nhật avatar</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 cursor-pointer">
                  <KeyRound className="w-4 h-4" />
                  <span>Đổi mật khẩu</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span>Sản phẩm yêu thích</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  asChild
                  onSelect={(e) => e.preventDefault()}
                  className="p-0"
                >
                  <AsyncButton
                    loading={loading}
                    onClick={handleLogout}
                    loadingText="Đang thoát..."
                    variant="destructive"
                    className="w-full cursor-pointer"
                  >
                    Đăng xuất
                  </AsyncButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/signup">Đăng ký</Link>
            </Button>

            <Button asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
