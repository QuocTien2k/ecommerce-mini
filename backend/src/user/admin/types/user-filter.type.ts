import { Role } from 'generated/prisma';

export type UserFilters = {
  id?: string;
  keyword?: string;
  isActive?: boolean;
  role?: Role;
};
