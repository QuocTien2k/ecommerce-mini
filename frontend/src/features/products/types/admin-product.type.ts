import type { AdminVariantResponse } from "./admin-variant.type";

export type AdminProductListQueryParams = {
  page?: number;
  limit?: number;

  // search by product name
  search?: string;

  // filter by category
  categoryId?: string;

  // admin filter active status
  isActive?: boolean;
};

export type AdminProductListItem = {
  id: string;

  name: string;
  slug: string;
  description: string;

  price: string;
  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number | null;
  ratingCount: number;

  isActive: boolean;

  categoryId: string;

  createdAt: string;
  updatedAt: string;
};

export type AdminProductDetail = {
  id: string;

  name: string;
  slug: string;
  description: string | null;

  price: string;
  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number;
  ratingCount: number;

  isActive: boolean;

  categoryId: string;

  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    slug: string;
  };

  creator: {
    id: string;
    fullname: string;
  };

  variants: AdminVariantResponse[];
};

/*Action*/
export type AdminCreateProductPayload = {
  name: string;

  slug?: string;

  description?: string;

  price: number;

  discountPct?: number;

  isActive?: boolean;

  categoryId: string;
};

export type AdminCreateProductResponse = {
  id: string;

  name: string;
  slug: string;
  description: string | null;

  price: string;
  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number | null;
  ratingCount: number;

  isActive: boolean;

  categoryId: string;

  creatorId: string;

  createdAt: string;
  updatedAt: string;
};
