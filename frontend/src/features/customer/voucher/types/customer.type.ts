import type {
  VoucherScope,
  VoucherType,
} from "@features/admin/vouchers/types/admin-voucher.type";

export interface CustomerVoucher {
  id: string;

  code: string;

  type: VoucherType;
  value: string;

  maxDiscount: string | null;
  minOrderValue: string | null;

  usageLimit: number | null;

  scope: VoucherScope;

  startAt: string | null;
  endAt: string | null;
}

export interface UserVoucher {
  id: string;

  voucherId: string;
  userId: string;

  remainingUsage: number | null;

  assignedAt: string;

  voucher: CustomerVoucher;
}

export interface GetMyVouchersQuery {
  page?: number;
  limit?: number;
}
