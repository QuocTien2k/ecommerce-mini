import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import type { AdminUser } from "@features/admin/user/types/adminUser.type";
import { Camera, Heart, KeyRound, Ticket, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  onOpenProfile: () => void;
  onOpenAvatar: () => void;
  onOpenPassword: () => void;
  onLogout: () => void;
};

export const MobileUserPanel = ({
  user,
  isAuthenticated,
  onOpenProfile,
  onOpenAvatar,
  onOpenPassword,
  onLogout,
}: Props) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="space-y-4 pt-8">
        <div>
          <h3 className="font-semibold">Chào mừng đến với TechStore</h3>

          <p className="text-sm text-muted-foreground">
            Đăng nhập để quản lý đơn hàng và giỏ hàng của bạn
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link to="/login">Đăng nhập</Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full">
          <Link to="/signup">Đăng ký</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* User header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar ?? "/avatar_user.jpg"} />
          <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="text-sm font-medium truncate">{user?.fullname}</div>
      </div>

      {/* Account actions */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          className="justify-start gap-2 h-11"
          onClick={onOpenProfile}
        >
          <User className="h-4 w-4" />
          Cập nhật thông tin
        </Button>

        <Button
          variant="ghost"
          className="justify-start gap-2 h-11"
          onClick={onOpenAvatar}
        >
          <Camera className="h-4 w-4" />
          Cập nhật avatar
        </Button>

        <Button
          variant="ghost"
          className="justify-start gap-2 h-11"
          onClick={onOpenPassword}
        >
          <KeyRound className="h-4 w-4" />
          Đổi mật khẩu
        </Button>
      </div>

      {/* Shop actions */}
      <div className="flex flex-col gap-1 border-t pt-2">
        <Button
          variant="ghost"
          className="justify-start gap-2 h-11"
          onClick={() => navigate("/favorites")}
        >
          <Heart className="h-4 w-4" />
          Sản phẩm yêu thích
        </Button>

        <Button
          variant="ghost"
          className="justify-start gap-2 h-11"
          onClick={() => navigate("/my-vouchers")}
        >
          <Ticket className="h-4 w-4" />
          Voucher của tôi
        </Button>
      </div>

      {/* Logout */}
      <div className="pt-2 border-t">
        <Button variant="destructive" className="w-full" onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};
