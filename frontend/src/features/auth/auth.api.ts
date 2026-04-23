import { api } from "@shared/api/axios";
import type { LoginResponseDto } from "./types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponseDto>("/auth/login", { email, password }),

  refresh: () => api.post<LoginResponseDto>("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get("/auth/me"),
};
