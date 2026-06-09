import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@app/hooks";

type Props = {
  onClick?: () => void;
};

export const NotificationBell = ({ onClick }: Props) => {
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  const hasUnread = unreadCount > 0;

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <Bell className={`size-5 ${hasUnread ? "animate-bell-shake" : ""}`} />

      {hasUnread && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      )}
    </Button>
  );
};
