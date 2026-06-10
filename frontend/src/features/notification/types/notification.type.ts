export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  path?: string;
  isRead: boolean;
  createdAt?: string;
}

export interface NotificationQueryParams {
  isRead?: boolean;
  page?: number;
  limit?: number;
}
