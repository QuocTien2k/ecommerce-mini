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
  logo?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
