import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAppDispatch } from "@app/hooks";
import { useUnreadNotificationCountQuery } from "../hooks/useNotifications";
import { setUnreadCount } from "../store/notification.slice";

export const NotificationWidget = () => {
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  //click outside => close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: unreadData } = useUnreadNotificationCountQuery();

  useEffect(() => {
    if (unreadData?.data?.count !== undefined) {
      dispatch(setUnreadCount(unreadData.data.count));
    }
  }, [unreadData, dispatch]);

  return (
    <div ref={widgetRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>
        <NotificationBell />
      </div>

      <NotificationDropdown open={open} />
    </div>
  );
};
