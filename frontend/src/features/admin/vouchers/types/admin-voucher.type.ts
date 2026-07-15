import type {
  VoucherScope,
  VoucherStatus,
  VoucherTarget,
  VoucherType,
} from "@shared/types/voucher";

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
  target: VoucherTarget;

  isActive: boolean;
  isDeleted: boolean;

  startAt: string | null;
  endAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AdminVoucherDetail extends AdminVoucher {
  productIds: string[];

  categoryIds: string[];

  products: {
    id: string;
    name: string;
  }[];

  categories: {
    id: string;
    name: string;
  }[];
}

export interface GetAdminVouchersQuery {
  page?: number;
  limit?: number;

  search?: string;

  type?: VoucherType;

  scope?: VoucherScope;

  target?: VoucherTarget;

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
  target: VoucherTarget;

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

/* Assign Voucher */
export interface AssignVoucherPayload {
  userIds: string[];
  usagePerUser?: number;
}

export interface AssignVoucherResponse {
  assigned: number;
  userIds: string[];
  voucher: AdminVoucher;
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
