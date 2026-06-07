import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "../schema/account.schema";

export const useChangePasswordForm = () => {
  return useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    mode: "onSubmit",
  });
};
