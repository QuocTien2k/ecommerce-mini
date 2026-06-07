import z from "zod";

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
