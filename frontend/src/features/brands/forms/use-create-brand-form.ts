import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createBrandSchema,
  type CreateBrandSchema,
} from "../schemas/brand.schema";

export const useCreateBrandForm = () => {
  return useForm<CreateBrandSchema>({
    resolver: zodResolver(createBrandSchema),

    defaultValues: {
      name: "",
      isActive: true,
    },

    mode: "onSubmit",
  });
};
