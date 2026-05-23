import { Role } from '@prisma/client';

export type UserFilters = {
  id?: string;
  keyword?: string;
  isActive?: boolean;
  role?: Role;

  sortBy?: 'createdAt' | 'fullname' | 'email';
  sortOrder?: 'asc' | 'desc';
};
