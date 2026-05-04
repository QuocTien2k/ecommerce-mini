import { api } from "@shared/api/axios";

export const userApi = {
  getMe: () => api.get("/user/me"),
};
