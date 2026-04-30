import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),

    phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),

    fullname: z
      .string()
      .min(1, "Họ tên không được rỗng")
      .regex(/\S/, "Họ tên không được rỗng"),

    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Mật khẩu phải có chữ hoa, chữ thường và số",
      ),

    confirmPassword: z.string(),

    address: z
      .string()
      .min(1, "Địa chỉ không được rỗng")
      .max(255, "Địa chỉ tối đa 255 ký tự")
      .regex(/\S/, "Địa chỉ không được rỗng"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
