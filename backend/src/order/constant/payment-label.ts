import { PaymentMethod } from '@prisma/client';

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: 'COD',
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
};
