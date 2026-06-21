export const PAYMENT_METHODS = {
  COD: "COD",
  VNPAY: "VNPAY",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export interface CodPaymentResponse {
  method: "COD";
  paymentId: string;
  status: PaymentStatus;
}

export interface VnpayPaymentResponse {
  method: "VNPAY";
  paymentId: string;
  paymentUrl: string;
}

export type OrderPaymentResponse = CodPaymentResponse | VnpayPaymentResponse;
