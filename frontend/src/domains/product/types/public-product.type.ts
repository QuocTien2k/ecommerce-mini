import type { PaginatedResponse } from "@shared/types/pagination";

export type PublicProductListQueryParams = {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;

  brandId?: string;

  priceSort?: "asc" | "desc";
};

export type PublicProductListItem = {
  id: string;

  name: string;
  slug: string;
  description: string | null;

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
