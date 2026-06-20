import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationQuery } from "./useNotifications";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import {
  useMarkAllAsReadNotification,
  useMarkAsReadNotification,
} from "./useMarkAsRead";
import { useAppSelector } from "@app/hooks";
import type { NotificationItem } from "../types/notification.type";

export const useNotifications = () => {
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const [page] = useState(1);
  const [limit] = useState(5);

  const navigate = useNavigate();

  const { data } = useNotificationQuery({
    page,
    limit,
  });

  const { loading } = useScopedLoading();

  const { mutateAsync: markAsRead } = useMarkAsReadNotification();

  const { mutateAsync: markAllAsRead, isPending } =
    useMarkAllAsReadNotification();

  const socketNotifications = useAppSelector(
    (state) => state.notification.items,
  );

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

  //đọc 1 tin
  const handleNotificationClick = async (
    notification: NotificationItem,
    onClose?: () => void,
  ) => {
    if (notification.path) {
      navigate(notification.path);
    }

    onClose?.();

    if (!notification.isRead) {
      await markAsRead({
        id: notification.id,
      });
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

  return {
    loading,
    merged,
    unreadCount,
    isPending,
    handleNotificationClick,
    handleMarkAllRead,
  };
};
