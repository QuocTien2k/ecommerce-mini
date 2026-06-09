import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import {
  NOTIFICATION_QUERY_KEY,
  UNREAD_NOTIFICATION_COUNT_QUERY_KEY,
} from "./useNotifications";

interface MarkAsReadParams {
  id: string;
}

export const useMarkAsReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: MarkAsReadParams) => notificationApi.markAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [UNREAD_NOTIFICATION_COUNT_QUERY_KEY],
      });
    },
  });
};

export const useMarkAllAsReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [UNREAD_NOTIFICATION_COUNT_QUERY_KEY],
      });
    },
  });
};
