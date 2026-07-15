import { VoucherScope, VoucherTarget, VoucherType } from '@prisma/client';

export class AvailableVoucherDto {
  id: string;

  code: string;

  type: VoucherType;

  value: number;

  maxDiscount: number | null;

  minOrderValue: number | null;

  scope: VoucherScope;

  target: VoucherTarget;

  endAt: Date | null;

  subtotal: number;

  appliedSubtotal: number;

  discount: number;

  finalTotal: number;

  remainingUsage: number | null;
}
