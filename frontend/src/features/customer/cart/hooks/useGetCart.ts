import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";
import { customerCartApi } from "../api/customerCart.api";

export const useGetCart = () => {
  return useQuery({
    queryKey: [CUSTOMER_CART_QUERY_KEY],
    queryFn: () => customerCartApi.getCart(),
  });
};
