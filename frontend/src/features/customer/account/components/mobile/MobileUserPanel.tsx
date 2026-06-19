import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import type { AdminUser } from "@features/admin/user/types/adminUser.type";
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
      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link to="/login">Đăng nhập</Link>
        </Button>

        <Button asChild variant="outline">
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
          className="justify-start"
          onClick={onOpenProfile}
        >
          Cập nhật thông tin
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={onOpenAvatar}
        >
          Cập nhật avatar
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={onOpenPassword}
        >
          Đổi mật khẩu
        </Button>
      </div>

      {/* Shop actions */}
      <div className="flex flex-col gap-1 pt-2 border-t">
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => navigate("/favorites")}
        >
          Sản phẩm yêu thích
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => navigate("/my-vouchers")}
        >
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
