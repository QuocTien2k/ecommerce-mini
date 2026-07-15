import type { AvailableVoucher } from "@features/customer/voucher/types/customer.type";
import { formatCurrency } from "@lib/format-currency";
import { VOUCHER_TYPES } from "@shared/types/voucher";

export const getVoucherLabel = (voucher: AvailableVoucher) => {
  if (voucher.type === VOUCHER_TYPES.FIXED) {
    return `Giảm ${formatCurrency(voucher.value)}`;
  }

  return `Giảm ${voucher.value}%${
    voucher.maxDiscount
      ? ` (tối đa ${formatCurrency(voucher.maxDiscount)})`
      : ""
  }`;
};
