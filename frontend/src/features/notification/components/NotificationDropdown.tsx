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

type Props = {
  open: boolean;
};

export const NotificationDropdown = ({ open }: Props) => {
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(5);

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
  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead || readingId === id) return;

    try {
      setReadingId(id);

      await markAsRead({ id });
    } catch (error) {
      console.error("Mark notification read error:", error);
    } finally {
      setReadingId(null);
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
          className="
        absolute right-0 mt-2 w-96 rounded-lg border bg-white shadow-xl z-50
      "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <span className="text-lg font-semibold">Thông báo</span>

            <button
              disabled={isPending || unreadCount === 0}
              onClick={handleMarkAllRead}
              className="cursor-pointer text-sm font-medium text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
            </button>
          </div>

          {/* Body */}
          <div className="max-h-125 overflow-y-auto">
            {loading ? (
              <div className="py-6">
                <Loading text="Đang tải thông báo..." size="md" />
              </div>
            ) : merged.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Không có thông báo
              </div>
            ) : (
              merged.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.isRead)}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${readingId === n.id ? "pointer-events-none opacity-60" : ""}`}
                >
                  {/* Title */}
                  <div
                    className={`text-base ${
                      n.isRead ? "font-medium" : "font-semibold"
                    }`}
                  >
                    {n.title}
                  </div>

                  {/* Message */}
                  {n.message && (
                    <div className="mt-1 text-sm leading-6 text-gray-600">
                      {n.message}
                    </div>
                  )}

                  {/* Time */}
                  <div className="mt-2 text-xs text-gray-400">
                    {formatRelativeTime(n.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
