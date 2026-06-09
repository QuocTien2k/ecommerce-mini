import { useState } from "react";
import { useAppSelector } from "@app/hooks";
import { useNotificationQuery } from "../hooks/useNotifications";
import { useMarkAsReadNotification } from "../hooks/useMarkAsRead";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import Loading from "@components/ui/loading";

type Props = {
  open: boolean;
};

export const NotificationDropdown = ({ open }: Props) => {
  const [page] = useState(1);
  const [limit] = useState(5);

  const { data } = useNotificationQuery({
    page,
    limit,
  });
  const { loading } = useScopedLoading();

  //console.log("notification list:", data);

  const { mutate: markAsRead } = useMarkAsReadNotification();

  const socketNotifications = useAppSelector(
    (state) => state.notification.items,
  );

  if (!open) return null;

  const apiItems = Array.isArray(data?.data) ? data.data : [];

  /**
   * MERGE STRATEGY:
   * socket items ưu tiên mới nhất + tránh duplicate theo id
   */
  const merged = [...socketNotifications, ...apiItems].filter(
    (item, index, self) => index === self.findIndex((n) => n.id === item.id),
  );

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-md border bg-white shadow-lg">
      <div className="p-3 border-b text-sm font-medium">Thông báo</div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <Loading text="Đang tải" size="md" />
        ) : merged.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">Không có thông báo</div>
        ) : (
          merged.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead({ id: n.id })}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                n.isRead ? "opacity-60" : "font-medium"
              }`}
            >
              <div className="text-sm">{n.title}</div>
              {n.message && (
                <div className="text-xs text-gray-500">{n.message}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
