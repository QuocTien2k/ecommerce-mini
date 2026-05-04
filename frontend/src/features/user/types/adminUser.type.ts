import type { Role } from "@/types/role";

export interface AdminUser {
  id: string;
  email: string;
  phone: string;
  fullname: string;
  avatar: string | null;
  avatarPublicId: string | null;
  address: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersData {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
