import type {
  Province,
  ProvinceApiResponse,
  Ward,
  WardApiResponse,
} from "@/types/address";
import { api } from "@shared/api/axios";

interface GetProvinceParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getProvinces = async (
  params?: GetProvinceParams,
): Promise<Province[]> => {
  const response = await api.get<ProvinceApiResponse>("/vietnamprovince", {
    params: {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
    },
  });

  return response.data.data.map((item) => ({
    id: item.id,
    name: item.name,
  }));
};

export const getWardsByProvince = async (province: string): Promise<Ward[]> => {
  const response = await api.get<WardApiResponse>("/vietnamprovince", {
    params: {
      province,
    },
  });

  return response.data.data.map((item) => ({
    name: item.name,
  }));
};
