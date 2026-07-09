import { User, Camera, KeyRound, Heart, Ticket, Package } from "lucide-react";

export const userMenuConfig = (actions: any) => [
  {
    icon: User,
    label: "Cập nhật thông tin",
    onClick: actions.profile,
  },
  {
    icon: Camera,
    label: "Cập nhật avatar",
    onClick: actions.avatar,
  },
  {
    icon: KeyRound,
    label: "Đổi mật khẩu",
    onClick: actions.password,
  },
  {
    icon: Heart,
    label: "Sản phẩm yêu thích",
    onClick: actions.wishlists,
  },
  {
    icon: Ticket,
    label: "Voucher của tôi",
    onClick: actions.vouchers,
  },
  {
    icon: Package,
    label: "Đơn hàng của tôi",
    onClick: actions.orders,
  },
];
