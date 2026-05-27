export const VOUCHER_TYPES = {
  PERCENT: "PERCENT",
  FIXED: "FIXED",
} as const;

export type VoucherType = (typeof VOUCHER_TYPES)[keyof typeof VOUCHER_TYPES];

export const VOUCHER_SCOPES = {
  ORDER: "ORDER",
  PRODUCT: "PRODUCT",
  CATEGORY: "CATEGORY",
} as const;

export type VoucherScope = (typeof VOUCHER_SCOPES)[keyof typeof VOUCHER_SCOPES];

export const VOUCHER_STATUSES = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
} as const;

export type VoucherStatus =
  (typeof VOUCHER_STATUSES)[keyof typeof VOUCHER_STATUSES];

export interface AdminVoucher {
  id: string;

  code: string;

  type: VoucherType;
  value: string;

  maxDiscount: string | null;

  minOrderValue: string | null;

  usageLimit: number | null;

  usedCount: number;

  scope: VoucherScope;

  isActive: boolean;
  isDeleted: boolean;

  startAt: string | null;
  endAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface GetAdminVouchersQuery {
  page?: number;
  limit?: number;

  search?: string;

  type?: VoucherType;

  scope?: VoucherScope;

  status?: VoucherStatus;

  isActive?: boolean;
}

/* Action */
export interface CreateVoucherPayload {
  code: string;

  type: VoucherType;

  value: number;

  maxDiscount?: number;

  minOrderValue?: number;

  usageLimit: number;

  scope: VoucherScope;

  isActive: boolean;

  startAt: string;
  endAt: string;

  productIds?: string[];

  categoryIds?: string[];
}

export interface UpdateVoucherPayload {
  isActive?: boolean;

  startAt?: string;
  endAt?: string;

  usageLimit?: number;

  minOrderValue?: number;
}

/* Response */
export interface GetAdminVouchersResponse {
  data: AdminVoucher[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateVoucherResponse {
  data: AdminVoucher;
}

export interface UpdateVoucherResponse {
  data: AdminVoucher;
}
