import { useQuery } from "@tanstack/react-query";
import { adminProductApi } from "../api/adminProduct.api";

export const useAdminProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin-product-detail", id],
    queryFn: async () => {
      const res = await adminProductApi.getDetail(id);
      return res.data;
    },
    enabled: !!id,
  });
};
