import type { ApiResult } from "@shared/types/api-result";
import type {
  NotificationItem,
  NotificationQueryParams,
} from "../types/notification.type";
import type { PaginatedResponse } from "@shared/types/pagination";
import { api } from "@shared/api/axios";

export const notificationApi = {
  getList: (
    params?: NotificationQueryParams,
  ): ApiResult<PaginatedResponse<NotificationItem>> =>
    api.get("/notifications", { params }),

  markAsRead: (id: string): ApiResult<void> =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: (): ApiResult<void> => api.patch("/notifications/read-all"),
};
