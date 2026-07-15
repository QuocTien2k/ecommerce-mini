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

export const VOUCHER_TARGETS = {
  GLOBAL: "GLOBAL",
  PERSONAL: "PERSONAL",
} as const;

export type VoucherTarget =
  (typeof VOUCHER_TARGETS)[keyof typeof VOUCHER_TARGETS];
