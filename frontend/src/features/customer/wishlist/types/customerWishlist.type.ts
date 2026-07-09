import type { ProductCardItem } from "@/domains/product/types/public-product.type";

export interface GetWishlistQuery {
  page?: number;
  limit?: number;
}

export interface WishlistItem extends ProductCardItem {
  isActive: boolean;
  deletedAt: string | null;

  wishedAt: string;
}
