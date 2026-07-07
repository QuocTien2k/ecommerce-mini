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
