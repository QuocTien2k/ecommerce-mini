import { z } from "zod";
import type { PaymentMethod } from "../types/payment.type";

export const orderFormSchema = z.object({
  receiverPhone: z.string().trim().min(10, "Số điện thoại không hợp lệ"),

  receiverAddress: z.string().trim().min(5, "Địa chỉ quá ngắn"),
  paymentMethod: z.enum(["COD", "VNPAY"]) satisfies z.ZodType<PaymentMethod>,
});

export type OrderFormSchema = z.infer<typeof orderFormSchema>;
