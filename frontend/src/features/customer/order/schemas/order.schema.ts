import { z } from "zod";
import type { PaymentMethod } from "../types/payment.type";

export const orderFormSchema = z.object({
  receiverPhone: z.string().trim().min(10, "Số điện thoại không hợp lệ"),

  receiverAddress: z.string().trim().min(5, "Địa chỉ quá ngắn"),
  paymentMethod: z.enum([
    "COD",
    "VNPAY",
    "MOMO",
  ]) satisfies z.ZodType<PaymentMethod>,
  note: z.string().max(300, "Ghi chú không được vượt quá 300 ký tự").optional(),
});

export type OrderFormSchema = z.infer<typeof orderFormSchema>;
