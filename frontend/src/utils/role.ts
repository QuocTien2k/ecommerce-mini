import { Role } from "@/types/role";

export const isValidRole = (role: string): role is Role => {
  return Object.values(Role).includes(role as Role);
};
