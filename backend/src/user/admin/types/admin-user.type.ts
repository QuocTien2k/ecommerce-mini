import { Role } from '@prisma/client';

export interface AdminUserQuery {
  page?: number | string;
  limit?: number | string;

  id?: string;
  keyword?: string; // email | phone
  isActive?: boolean | string;
  role?: Role;

  sortBy?: 'createdAt' | 'fullname' | 'email';
  sortOrder?: 'asc' | 'desc';
}
