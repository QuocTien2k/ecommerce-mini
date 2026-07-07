import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { UploadAvatar } from "@features/customer/account/components/UploadAvatar";
import { UpdateProfile } from "@features/customer/account/components/UpdateProfile";
import { ChangePassword } from "@features/customer/account/components/ChangePassword";
import { NotificationWidget } from "@features/notification/components/NotificationWidget";
import { ProductSearch } from "@/domains/product/components/ProductSearch";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileUserPanel } from "@features/customer/account/components/mobile/MobileUserPanel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CartButton } from "@features/customer/cart/components/CartButton";
import { userMenuConfig } from "@features/customer/config/user-menu.config";
import { SiteLogo } from "@components/common/logo";

type ActiveModal = null | "profile" | "avatar" | "password";

function renderMenuItem(item: any, index: number) {
  const Icon = item.icon;

  return (
    <DropdownMenuItem
      key={index}
      className="px-3 py-2 cursor-pointer"
      onClick={item.onClick}
      disabled={!item.onClick}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
    </DropdownMenuItem>
  );
}

const Header = () => {
  //check auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);

  //modal
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [openSheet, setOpenSheet] = useState(false);

  const openModal = (modal: Exclude<ActiveModal, null>) => {
    setOpenSheet(false);
    setActiveModal(modal);
  };

  const location = useLocation();

  useEffect(() => {
    setOpenSheet(false);
  }, [location.pathname]);

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

  const userActions = {
    profile: () => openModal("profile"),
    avatar: () => openModal("avatar"),
    password: () => openModal("password"),
    orders: () => navigate("/orders"),
    vouchers: () => navigate("/my-vouchers"),
  };

  const menuItems = userMenuConfig(userActions);

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {/* Mobile */}
      <div className="md:hidden border-b">
        <div className="container mx-auto px-4 py-2">
          {/* Top row */}
          <div className="flex h-12 items-center justify-between">
            <SiteLogo
              className="shrink-0"
              imageClassName="h-9 w-auto object-contain"
              textClassName="text-lg font-bold tracking-tight"
            />

            <div className="flex items-center gap-1">
              {isAuthenticated && <NotificationWidget mobile={true} />}

              {isAuthenticated && <CartButton />}

              <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                  <Button
                    onClick={() => setOpenSheet(true)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72 p-4">
                  <VisuallyHidden>
                    <SheetTitle>Menu</SheetTitle>
                  </VisuallyHidden>

                  <MobileUserPanel
                    user={user}
                    isAuthenticated={isAuthenticated}
                    onOpenProfile={() => openModal("profile")}
                    onOpenAvatar={() => openModal("avatar")}
                    onOpenPassword={() => openModal("password")}
                    onLogout={handleLogout}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search */}
          <div className="mt-2">
            <ProductSearch />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4">
          {/* Logo */}
          <SiteLogo
            className="shrink-0"
            imageClassName="h-15 w-auto object-contain"
            textClassName="text-2xl font-bold tracking-tight"
          />

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <ProductSearch />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationWidget />

                <CartButton />

                <DropdownMenu modal={false}>
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

                      <span className="font-medium">{user?.fullname}</span>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-60 p-2 max-h-80 overflow-y-auto"
                  >
                    {menuItems.map(renderMenuItem)}

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
      </div>

      {/* Modal */}
      <UploadAvatar
        open={activeModal === "avatar"}
        onClose={() => setActiveModal(null)}
      />

      <UpdateProfile
        open={activeModal === "profile"}
        onClose={() => setActiveModal(null)}
      />

      <ChangePassword
        open={activeModal === "password"}
        onClose={() => setActiveModal(null)}
      />
    </header>
  );
};

export default Header;
