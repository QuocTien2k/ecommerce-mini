import { api } from "@shared/api/axios";
import type { LoginResponseDto, ResetPasswordDto } from "./types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponseDto>("/auth/login", { email, password }),

  refresh: () => api.post<LoginResponseDto>("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get("/auth/me"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (data: ResetPasswordDto) =>
    api.post("/auth/reset-password", data),
};
