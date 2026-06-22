import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  orderReceiverSchema,
  type OrderReceiverSchema,
} from "../schemas/order.schema";

export const useOrderReceiverForm = (phone?: string, address?: string) => {
  return useForm<OrderReceiverSchema>({
    resolver: zodResolver(orderReceiverSchema),

    defaultValues: {
      receiverPhone: phone ?? "",
      receiverAddress: address ?? "",
    },

    mode: "onSubmit",
  });
};
