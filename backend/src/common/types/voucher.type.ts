import { VoucherType } from '@prisma/client';

export type ApplyVoucherResult = {
  subtotal: number;
  discount: number;
  finalTotal: number;
  appliedSubtotal: number;
  voucherId: string;
  voucherCode?: string;
  type?: VoucherType;
  value?: number;
  usageLimit?: number | null;
  remainingUsage?: number | null;
};
