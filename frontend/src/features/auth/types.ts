import type { Role } from "@/types/role";

export interface LoginResponseDto {
  accessToken: string;
}

export interface MeResponseDto {
  id: string;
  email: string;
  role: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SignupUserDto {
  email: string;
  phone: string;
  fullname: string;
  password: string;
  address: string;
}

export interface AuthUserResponseDto {
  id: string;
  email: string;
  role: Role; // hoặc import enum Role nếu bạn đã define ở FE
}
