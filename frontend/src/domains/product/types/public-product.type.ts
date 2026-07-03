import type { PaginatedResponse } from "@shared/types/pagination";

export type PublicProductListQueryParams = {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;

  brandId?: string;

  priceSort?: "asc" | "desc";

  minRating?: number;
};

export type PublicProductListItem = {
  id: string;

  name: string;
  slug: string;
  description: string | null;
  thumbnail: string;

  price: string;
  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number | null;
  ratingCount: number;

  categoryId: string;
  brandId: string;

  createdAt: string;
  updatedAt: string;
};

export type CategoryBreadcrumb = {
  id: string;
  name: string;
  parentId: string | null;
};

export type PublicProductListResponse =
  PaginatedResponse<PublicProductListItem> & {
    breadcrumb: CategoryBreadcrumb[];
  };

export type PublicHomeProductsResponse = PublicProductListItem[];

/* Case detail */
export type ProductVariantAttributes = Record<string, string>;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Creator {
  id: string;
  fullname: string;
}

export type PublicProductVariant = {
  id: string;

  color: string;

  attributes: ProductVariantAttributes;

  images: string[];

  stock: number;
};

export type PublicProductDetailResponse = {
  id: string;

  name: string;
  slug: string;

  description: string | null;

  thumbnail: string;

  price: string;

  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number | null;
  ratingCount: number;

  category: Category;

  creator: Creator;

  variants: PublicProductVariant[];
};
