import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "../schema/account.schema";

export const useUpdateProfileForm = () => {
  return useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),

    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      address: {
        detail: "",
        wardCode: "",
        provinceCode: "",
      },
    },

    mode: "onSubmit",
  });
};
