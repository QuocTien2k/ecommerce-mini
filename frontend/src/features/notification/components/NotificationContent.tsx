import Loading from "@components/ui/loading";
import type { NotificationItem } from "../types/notification.type";
import { formatRelativeTime } from "@lib/format-date";

interface Props {
  loading: boolean;
  merged: NotificationItem[];
  unreadCount: number;
  isPending: boolean;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
}

export const NotificationContent = ({
  loading,
  merged,
  unreadCount,
  isPending,
  onMarkAllRead,
  onNotificationClick,
}: Props) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <span className="text-lg font-semibold">Thông báo</span>

        <button
          disabled={isPending || unreadCount === 0}
          onClick={onMarkAllRead}
          className="cursor-pointer text-sm font-medium text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[70vh] overflow-y-auto">
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
              onClick={() => onNotificationClick(n)}
              className="cursor-pointer border-b p-4 transition-colors hover:bg-gray-50"
            >
              <div
                className={`text-base ${
                  n.isRead ? "font-medium" : "font-semibold"
                }`}
              >
                {n.title}
              </div>

              {n.message && (
                <div className="mt-1 text-sm leading-6 text-gray-600">
                  {n.message}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-400">
                {formatRelativeTime(n.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
