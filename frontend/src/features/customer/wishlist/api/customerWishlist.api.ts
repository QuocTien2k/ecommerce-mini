import type { ApiResult } from "@shared/types/api-result";
import type {
  GetWishlistQuery,
  WishlistItem,
} from "../types/customerWishlist.type";
import { api } from "@shared/api/axios";
import type { PaginatedResponse } from "@shared/types/pagination";

export const customerWishlistApi = {
  getWishlist: (
    params?: GetWishlistQuery,
  ): ApiResult<PaginatedResponse<WishlistItem>> =>
    api.get("/wishlist", { params }),
};
