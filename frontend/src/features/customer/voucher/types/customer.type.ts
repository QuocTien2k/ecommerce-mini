import type {
  VoucherScope,
  VoucherTarget,
  VoucherType,
} from "@shared/types/voucher";

export interface CustomerVoucher {
  id: string;

  code: string;

  type: VoucherType;
  value: string;

  maxDiscount: string | null;
  minOrderValue: string | null;

  usageLimit: number | null;

  scope: VoucherScope;
  target: VoucherTarget;

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

export interface AvailableVoucher {
  id: string;
  code: string;

  type: VoucherType;
  scope: VoucherScope;
  target: VoucherTarget;

  value: number;
  maxDiscount: number | null;
  minOrderValue: number | null;

  subtotal: number;
  appliedSubtotal: number;
  discount: number;
  finalTotal: number;

  remainingUsage: number | null;
  endAt: string | null;
}
