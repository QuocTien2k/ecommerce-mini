import type { VariantType } from "@features/categories/types/admin-category.type";
import type { AdminVariantResponse } from "./admin-variant.type";

export type AdminProductListQueryParams = {
  page?: number;
  limit?: number;

  // search by product name
  search?: string;

  // filter by category
  categoryId?: string;

  // filter by brand
  brandId?: string;

  // admin filter active status
  isActive?: boolean;
};

export type AdminProductListItem = {
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
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };

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

  ratingAvg: number | null;
  ratingCount: number;

  isActive: boolean;

  categoryId: string;
  brandId: string;

  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    slug: string;
    variantType: VariantType;
  };

  brand?: {
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

  brandId: string;
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
  brandId: string;

  creatorId: string;

  createdAt: string;
  updatedAt: string;
};

export type AdminUpdateProductPayload = {
  name?: string;

  slug?: string;

  description?: string;

  price?: number;

  // undefined => giữ nguyên
  // null => xóa discount
  // number => cập nhật
  discountPct?: number | null;

  isActive?: boolean;

  categoryId?: string;
  brandId?: string;
};

export type AdminUpdateProductResponse = {
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
  brandId: string;

  creatorId: string;

  createdAt: string;
  updatedAt: string;
};
