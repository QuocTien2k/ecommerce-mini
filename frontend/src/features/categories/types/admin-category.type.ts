export const VARIANT_TYPES = {
  NONE: "NONE",
  SIZE_COLOR: "SIZE_COLOR",
  STORAGE: "STORAGE",
  SPEC: "SPEC",
  SWITCH: "SWITCH",
  CUSTOM: "CUSTOM",
} as const;

export type VariantType = (typeof VARIANT_TYPES)[keyof typeof VARIANT_TYPES];

export interface AdminCategoryQueryParams {
  search?: string;
  isActive?: boolean;
  parentId?: string | "null";
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;

  image: string | null;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  variantType: VariantType;
  canChangeVariantType: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
}

export interface FlatCategoryItem {
  id: string;
  name: string;
  level: number;
  isActive: boolean;
  isDeleted?: boolean;
}

//Action
export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  variantType: VariantType;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type UpdateCategoryPayload = {
  id: string;
  data: UpdateCategoryDto;
  file?: File;
};
