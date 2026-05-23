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
  description?: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandPayload {
  name: string;
  slug?: string;
  isActive?: boolean;
}

export type CreateBrandResponse = AdminBrandItem;
