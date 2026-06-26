import { useNavigate } from "react-router-dom";

export const useUserMenuActions = ({
  onOpenProfile,
  onOpenAvatar,
  onOpenPassword,
}: {
  onOpenProfile: () => void;
  onOpenAvatar: () => void;
  onOpenPassword: () => void;
}) => {
  const navigate = useNavigate();

  return {
    profile: onOpenProfile,
    avatar: onOpenAvatar,
    password: onOpenPassword,
    orders: () => navigate("/orders"),
    vouchers: () => navigate("/my-vouchers"),
  };
};
