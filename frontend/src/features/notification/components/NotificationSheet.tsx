import { NotificationContent } from "./NotificationContent";
import { Sheet, SheetContent } from "@components/ui/sheet";
import { useNotifications } from "../hooks/useNotificationCenter";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationSheet = ({ open, onOpenChange }: Props) => {
  const {
    loading,
    merged,
    unreadCount,
    isPending,
    handleNotificationClick,
    handleMarkAllRead,
  } = useNotifications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <NotificationContent
          loading={loading}
          merged={merged}
          unreadCount={unreadCount}
          isPending={isPending}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={(notification) =>
            handleNotificationClick(notification, () => onOpenChange(false))
          }
        />
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
