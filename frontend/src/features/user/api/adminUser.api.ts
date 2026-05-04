import { api } from "@shared/api/axios";
import type { GetUsersData } from "../types/adminUser.type";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const adminUserApi = {
  getUsers: (params?: GetUsersParams) =>
    api.get<GetUsersData>("/admin/users", { params }),

  lockUser: (userId: string) => api.patch(`/admin/users/${userId}/lock`),

  unlockUser: (userId: string) => api.patch(`/admin/users/${userId}/unlock`),
};
