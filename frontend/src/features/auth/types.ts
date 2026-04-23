export interface LoginResponseDto {
  accessToken: string;
}

export interface MeResponseDto {
  id: string;
  email: string;
  role: string;
}
