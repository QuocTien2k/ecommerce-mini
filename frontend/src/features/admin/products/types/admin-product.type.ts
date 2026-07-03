import type { VariantType } from "@features/admin/categories/types/admin-category.type";
import type { AdminVariantResponse } from "./admin-variant.type";

type ProductBase = {
  id: string;

  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;

  price: string;
  discountPrice: string | null;
  discountPct: number | null;

  ratingAvg: number | null;
  ratingCount: number;

  isActive: boolean;
  deletedAt: string | null;

  categoryId: string;
  brandId: string;

  createdAt: string;
  updatedAt: string;
};

type ProductBrand = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductListItem = ProductBase & {
  brand: ProductBrand;
};

export type AdminProductDetail = ProductBase & {
  category: {
    id: string;
    name: string;
    slug: string;
    variantType: VariantType;
  };

  brand?: ProductBrand;

  creator: {
    id: string;
    fullname: string;
  };

  variants: AdminVariantResponse[];
};

/*Action*/
export type AdminCreateProductResponse = ProductBase & {
  creatorId: string;
};

export type AdminUpdateProductResponse = ProductBase & {
  creatorId: string;
};

export type AdminProductListQueryParams = {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;

  brandId?: string;

  priceSort?: "asc" | "desc";

  minRating?: number;

  isActive?: boolean;
};

export type AdminCreateProductPayload = {
  name: string;

  description?: string;

  thumbnail: string;

  price: number;

  discountPct?: number;

  isActive?: boolean;

  categoryId: string;

  brandId: string;
};

export type AdminUpdateProductPayload = {
  name?: string;

  description?: string;

  thumbnail?: string;

  price?: number;

  discountPct?: number | null;

  isActive?: boolean;

  categoryId?: string;

  brandId?: string;
};
