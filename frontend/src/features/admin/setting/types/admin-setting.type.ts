import type { Setting } from "@/domains/setting/types/setting.type";

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
