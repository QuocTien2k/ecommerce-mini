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

    address: z.object({
      detail: z
        .string()
        .min(1, "Địa chỉ chi tiết không được rỗng")
        .regex(/\S/, "Địa chỉ chi tiết không được rỗng"),

      ward: z.string().min(1, "Vui lòng chọn phường/xã"),

      province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
