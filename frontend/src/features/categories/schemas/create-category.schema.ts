import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự"),

  description: z.string().optional(),

  parentId: z.string().optional(),

  isActive: z.boolean(),

  file: z
    .instanceof(File, {
      message: "Vui lòng chọn ảnh",
    })
    .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB"),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
