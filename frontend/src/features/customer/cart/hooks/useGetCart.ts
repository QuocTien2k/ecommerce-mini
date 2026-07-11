import { useQuery } from "@tanstack/react-query";

import { customerCartApi } from "../api/customerCart.api";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useGetCart = () => {
  return useQuery({
    queryKey: CUSTOMER_CART_QUERY_KEY.all,
    queryFn: () => customerCartApi.getCart(),
  });
};
