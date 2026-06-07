import z from "zod";

//update profle
export const updateProfileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Họ và tên tối thiểu 2 ký tự")
    .max(100, "Họ và tên tối đa 100 ký tự"),

  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),

  email: z.email("Email không hợp lệ"),

  address: z.object({
    detail: z
      .string()
      .min(1, "Địa chỉ chi tiết không được rỗng")
      .regex(/\S/, "Địa chỉ chi tiết không được rỗng"),

    // provinceCode thay vì province (semantic rõ hơn)
    provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành"),

    // wardCode thay vì ward
    wardCode: z.string().min(1, "Vui lòng chọn phường/xã"),
  }),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

//Change password
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Mật khẩu cũ tối thiểu 6 ký tự"),

    newPassword: z
      .string()
      .min(6, "Mật khẩu mới tối thiểu 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Mật khẩu phải có chữ hoa, chữ thường và số",
      ),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
