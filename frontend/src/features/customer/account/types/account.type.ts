export interface UploadAvatarResponse {
  avatar: string;
}

export interface UpdateProfilePayload {
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateProfileResponse {
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
