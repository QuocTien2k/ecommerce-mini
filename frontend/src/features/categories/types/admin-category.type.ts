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

  parentId: string | null;

  parent: {
    id: string;
    name: string;
    parentId: string | null;
  } | null;

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
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type UpdateCategoryPayload = {
  id: string;
  data: UpdateCategoryDto;
  file?: File;
};
