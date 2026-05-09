export interface Province {
  id: number;
  name: string;
}

export interface Ward {
  name: string;
}

export interface ProvinceApiResponse {
  data: Province[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface WardApiResponse {
  data: Ward[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
