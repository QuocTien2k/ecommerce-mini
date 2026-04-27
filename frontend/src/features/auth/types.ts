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
