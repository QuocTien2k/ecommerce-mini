import { useQuery } from "@tanstack/react-query";
import type { NotificationQueryParams } from "../types/notification.type";
import { notificationApi } from "../api/notification.api";

export const NOTIFICATION_QUERY_KEY = "NOTIFICATION_QUERY_KEY";
export const UNREAD_NOTIFICATION_COUNT_QUERY_KEY =
  "UNREAD_NOTIFICATION_COUNT_QUERY_KEY";

//danh sách thông báo
export const useNotificationQuery = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY, params],
    queryFn: () => notificationApi.getList(params),
    placeholderData: (prev) => prev,
  });
};

//số thông báo
export const useUnreadNotificationCountQuery = () => {
  return useQuery({
    queryKey: [UNREAD_NOTIFICATION_COUNT_QUERY_KEY],
    queryFn: notificationApi.getUnreadCount,
  });
};
