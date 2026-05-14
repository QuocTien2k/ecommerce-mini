import { z } from "zod";

// reusable
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

const imageFilesSchema = z
  .array(imageFileSchema)
  .min(1, "Vui lòng chọn ít nhất 1 ảnh");

// base
const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .max(120, "Tên sản phẩm không được vượt quá 120 ký tự"),

  slug: z.string().trim().optional(),

  description: z.string().optional(),

  price: z.coerce.number().min(0, "Giá sản phẩm không hợp lệ"),

  discountPct: z.coerce.number().min(0).max(100).optional(),

  isActive: z.boolean(),

  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),

  color: z.string().trim().min(1, "Vui lòng nhập màu sản phẩm"),

  stock: z.coerce.number().min(0, "Số lượng tồn kho không hợp lệ"),

  attributes: z.record(z.string(), z.string()).optional(),
});

// create
export const createProductSchema = productBaseSchema.extend({
  files: imageFilesSchema,
});

// update
export const updateProductSchema = productBaseSchema.extend({
  files: imageFilesSchema.optional(),
});

export type CreateProductFormValues = z.input<typeof createProductSchema>;

export type CreateProductFormOutput = z.output<typeof createProductSchema>;

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
