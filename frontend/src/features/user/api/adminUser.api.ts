import { api } from "@shared/api/axios";

export const adminApi = {
  getUsers: () => api.get("/admin/users"),

  setUserActiveStatus: () => api.patch("/admin/users/:id/lock"),
};
