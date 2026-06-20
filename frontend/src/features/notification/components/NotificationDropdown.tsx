import { useState } from "react";
import { useAppSelector } from "@app/hooks";
import { useNotificationQuery } from "../hooks/useNotifications";
import {
  useMarkAllAsReadNotification,
  useMarkAsReadNotification,
} from "../hooks/useMarkAsRead";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import Loading from "@components/ui/loading";
import { formatRelativeTime } from "@lib/format-date";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { NotificationItem } from "../types/notification.type";
import { NotificationContent } from "./NotificationContent";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const NotificationDropdown = ({ open, onClose }: Props) => {
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(5);
  const navigate = useNavigate();

  const { data } = useNotificationQuery({
    page,
    limit,
  });
  const { loading } = useScopedLoading();

  //console.log("notification list:", data);

  const { mutateAsync: markAsRead } = useMarkAsReadNotification();

  const { mutateAsync: markAllAsRead, isPending } =
    useMarkAllAsReadNotification();

  const socketNotifications = useAppSelector(
    (state) => state.notification.items,
  );

  //đọc 1 tin
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.path) {
      navigate(notification.path);
    }

    onClose();

    if (!notification.isRead) {
      try {
        await markAsRead({
          id: notification.id,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  //đọc tất cả
  const handleMarkAllRead = async () => {
    if (markingAllRead || unreadCount === 0) return;

    try {
      setMarkingAllRead(true);

      await markAllAsRead();
    } finally {
      setMarkingAllRead(false);
    }
  };

  //if (!open) return null;

  const apiItems = Array.isArray(data?.data) ? data.data : [];

  /**
   * MERGE STRATEGY:
   * socket items ưu tiên mới nhất + tránh duplicate theo id
   */
  const merged = [...socketNotifications, ...apiItems].filter(
    (item, index, self) => index === self.findIndex((n) => n.id === item.id),
  );

  //lấy unread
  const unreadCount = merged.reduce(
    (count, notification) => (notification.isRead ? count : count + 1),
    0,
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-0 z-50 mt-2 w-96 rounded-lg border bg-white shadow-xl"
        >
          <NotificationContent
            loading={loading}
            merged={merged}
            unreadCount={unreadCount}
            isPending={isPending}
            onMarkAllRead={handleMarkAllRead}
            onNotificationClick={handleNotificationClick}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
