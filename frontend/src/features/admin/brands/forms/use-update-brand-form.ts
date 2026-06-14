import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateBrandSchema,
  type UpdateBrandSchema,
} from "../schemas/brand.schema";

export const useUpdateBrandForm = (
  defaultValues?: Partial<UpdateBrandSchema>,
) => {
  return useForm<UpdateBrandSchema>({
    resolver: zodResolver(updateBrandSchema),

    defaultValues: {
      name: defaultValues?.name ?? "",
      thumbnail: defaultValues?.thumbnail ?? "",
      isActive: defaultValues?.isActive ?? true,
    },

    mode: "onSubmit",
  });
};
