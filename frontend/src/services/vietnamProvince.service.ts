import type { Province } from "@/types/vietnamProvince";

const BASE_URL = "https://vietnamlabs.com/api/vietnamprovince";

let provinceCache: Province[] | null = null;

const normalizeProvince = (item: any): Province => {
  return {
    id: item.id,
    province: item.province,
    wards: (item.wards || []).map((ward: any) => ({
      name: ward.name,
    })),
  };
};

export const vietnamProvinceService = {
  async getAllProvinces(): Promise<Province[]> {
    // cache hit
    if (provinceCache) {
      return provinceCache;
    }

    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch provinces");
    }

    const json = await response.json();

    const normalized = (json.data || []).map(normalizeProvince);

    provinceCache = normalized;

    return normalized;
  },

  async getProvinceByName(province: string): Promise<Province> {
    const response = await fetch(
      `${BASE_URL}?province=${encodeURIComponent(province)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch province");
    }

    const json = await response.json();

    return normalizeProvince(json.data);
  },

  clearCache() {
    provinceCache = null;
  },
};
