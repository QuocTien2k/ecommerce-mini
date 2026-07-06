export interface Setting {
  id: string;

  siteName: string;

  logo: string | null;
  logoPublicId: string | null;

  email: string | null;

  hotline1: string | null;
  hotline2: string | null;

  address: string | null;

  workingHours: string | null;

  facebookUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  zaloUrl: string | null;

  googleMapUrl: string | null;

  createdAt: string;
  updatedAt: string;
}

/* Case create */
export interface CreateSettingPayload {
  siteName: string;

  logo?: string;

  email?: string;

  hotline1?: string;
  hotline2?: string;

  address?: string;

  workingHours?: string;

  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  zaloUrl?: string;

  googleMapUrl?: string;
}

export type CreateSettingResponse = Setting;
