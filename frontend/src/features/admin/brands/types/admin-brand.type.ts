export interface AdminBrandQueryParams {
  name?: string;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminBrandItem {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  description?: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandPayload {
  name: string;
  slug?: string;
  thumbnail: string;
  isActive?: boolean;
}
export interface UpdateBrandPayload {
  name?: string;
  thumbnail?: string;
  isActive?: boolean;
}

export type CreateBrandResponse = AdminBrandItem;
export type UpdateBrandResponse = AdminBrandItem;
