import { z } from "zod";

export const orderReceiverSchema = z.object({
  receiverPhone: z.string().trim().min(10, "Số điện thoại không hợp lệ"),

  receiverAddress: z.string().trim().min(5, "Địa chỉ quá ngắn"),
});

export type OrderReceiverSchema = z.infer<typeof orderReceiverSchema>;
