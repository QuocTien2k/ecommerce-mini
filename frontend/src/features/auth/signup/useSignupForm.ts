import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "./signup.schema";

export const useSignupForm = () => {
  return useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      phone: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      address: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
};
