import { z } from "zod";

// base
const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),

  description: z
    .string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional(),

  price: z.coerce
    .number()
    .int("Giá phải là số nguyên")
    .min(0, "Giá sản phẩm không hợp lệ"),

  discountPct: z.coerce
    .number()
    .int("Phần trăm giảm phải là số nguyên")
    .min(1)
    .max(100)
    .optional(),

  isActive: z.boolean().optional(),

  categoryId: z.string().uuid("Danh mục không hợp lệ"),
  brandId: z.string().uuid("Thương hiệu không hợp lệ"),
});

// create
export const createProductSchema = productBaseSchema;

export type CreateProductFormValues = z.input<typeof createProductSchema>;

export type CreateProductFormOutput = z.output<typeof createProductSchema>;

// update
export const updateProductSchema = productBaseSchema.partial().extend({
  discountPct: z
    .union([
      z.coerce.number().int("Phần trăm giảm phải là số nguyên").min(1).max(100),

      z.null(),
    ])
    .optional(),
});

export type UpdateProductFormValues = z.input<typeof updateProductSchema>;

export type UpdateProductFormOutput = z.output<typeof updateProductSchema>;
