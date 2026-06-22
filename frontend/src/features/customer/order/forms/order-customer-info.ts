import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderFormSchema, type OrderFormSchema } from "../schemas/order.schema";

export const useOrderForm = (phone?: string, address?: string) => {
  return useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),

    defaultValues: {
      receiverPhone: phone ?? "",
      receiverAddress: address ?? "",
      paymentMethod: "COD",
    },

    mode: "onSubmit",
  });
};
