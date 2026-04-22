import { api } from "@shared/api/axios";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  refresh: () => api.post("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get("/auth/me"),
};
