export interface Ward {
  name: string;
}

export interface Province {
  id: string;
  province: string;
  wards: Ward[];
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
