import { useEffect, useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAppDispatch } from "@app/hooks";
import { useUnreadNotificationCountQuery } from "../hooks/useNotifications";
import { setUnreadCount } from "../store/notification.slice";

export const NotificationWidget = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { data: unreadData } = useUnreadNotificationCountQuery();

  useEffect(() => {
    if (unreadData?.data?.count !== undefined) {
      dispatch(setUnreadCount(unreadData.data.count));
    }
  }, [unreadData, dispatch]);

  return (
    <div className="relative">
      <div onClick={() => setOpen((v) => !v)}>
        <NotificationBell />
      </div>

      <NotificationDropdown open={open} />
    </div>
  );
};
