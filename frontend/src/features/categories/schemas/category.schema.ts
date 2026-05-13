import { z } from "zod";

// reusable file
const imageFileSchema = z
  .instanceof(File, {
    message: "Vui lòng chọn ảnh",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File phải là hình ảnh",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Ảnh tối đa 5MB",
  });

// base
const categoryBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự"),

  description: z.string().optional(),

  parentId: z.string().optional(),

  isActive: z.boolean(),
});

// create
export const createCategorySchema = categoryBaseSchema.extend({
  file: imageFileSchema,
});

// update
export const updateCategorySchema = categoryBaseSchema.extend({
  file: imageFileSchema.optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
