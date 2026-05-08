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

export interface GetUsersParams {
  page?: number;
  limit?: number;

  id?: string;
  keyword?: string;

  role?: Role;

  isActive?: boolean;
}
