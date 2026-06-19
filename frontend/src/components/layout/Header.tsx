import { Camera, Heart, KeyRound, Ticket, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { UploadAvatar } from "@features/customer/account/components/UploadAvatar";
import { UpdateProfile } from "@features/customer/account/components/UpdateProfile";
import { ChangePassword } from "@features/customer/account/components/ChangePassword";
import { NotificationWidget } from "@features/notification/components/NotificationWidget";
import { ProductSearch } from "@/domains/product/components/ProductSearch";
import { CartDropdown } from "@features/customer/cart/components/CartDropdown";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileUserPanel } from "@features/customer/account/components/mobile/MobileUserPanel";

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
        <Link
          to="/"
          className="shrink-0 text-base sm:text-lg md:text-2xl font-bold tracking-tight"
        >
          TechStore
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <ProductSearch />
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <Menu className="w-7 h-7" strokeWidth={3.5} />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 p-4">
              <MobileUserPanel
                user={user}
                isAuthenticated={isAuthenticated}
                onOpenProfile={() => setOpenProfile(true)}
                onOpenAvatar={() => setOpenAvatar(true)}
                onOpenPassword={() => setOpenPassword(true)}
                onLogout={handleLogout}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-4">
                {/* Notification */}
                <NotificationWidget />

                {/* Cart */}
                <CartDropdown />

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

                  {/* Profile */}
                  <DropdownMenuContent
                    align="end"
                    className="w-60 p-2 max-h-80 overflow-y-auto"
                  >
                    <DropdownMenuItem
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => setOpenProfile(true)}
                    >
                      <User className="w-4 h-4" />
                      <span>Cập nhật thông tin</span>
                    </DropdownMenuItem>

                    {/* Avatar */}
                    <DropdownMenuItem
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => setOpenAvatar(true)}
                    >
                      <Camera className="w-4 h-4" />
                      <span>Cập nhật avatar</span>
                    </DropdownMenuItem>

                    {/* Password */}
                    <DropdownMenuItem
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => setOpenPassword(true)}
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Đổi mật khẩu</span>
                    </DropdownMenuItem>

                    {/* Favorite */}
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer">
                      <Heart className="w-4 h-4" />
                      <span>Sản phẩm yêu thích</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => navigate("/my-vouchers")}
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Voucher của tôi</span>
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
            </>
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
      </div>

      {/* Modal */}
      <UploadAvatar open={openAvatar} onClose={() => setOpenAvatar(false)} />
      <UpdateProfile open={openProfile} onClose={() => setOpenProfile(false)} />
      <ChangePassword
        open={openPassword}
        onClose={() => setOpenPassword(false)}
      />
    </header>
  );
};

export default Header;
