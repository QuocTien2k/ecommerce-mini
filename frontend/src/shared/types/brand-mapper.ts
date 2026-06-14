export interface BrandMapper {
  image: string;
}

export const BRAND_IMAGE_MAP: Record<string, BrandMapper> = {
  apple: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:format(webp):quality(75)/small/logo_iphone_ngang_eac93ff477.png",
  },

  oppo: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:format(webp):quality(75)/small/logo_oppo_ngang_68d31fcd73.png",
  },

  realme: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:format(webp):quality(75)/small/logo_realme_ngang_0185815a13.png",
  },

  samsung: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:format(webp):quality(75)/small/logo_samsung_ngang_1624d75bd8.png",
  },

  vivo: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/96x0/filters:format(webp):quality(75)/small/logo_vivo_ngang_45494ff733.png",
  },

  xiaomi: {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:format(webp):quality(75)/small/logo_xiaomi_ngang_0faf267234.png",
  },
};

export const getBrandImage = (slug: string) => {
  return BRAND_IMAGE_MAP[slug]?.image ?? "";
};
