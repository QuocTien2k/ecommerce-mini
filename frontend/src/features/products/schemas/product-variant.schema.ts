import { z } from "zod";

// reusable image
export const variantImagesSchema = z
  .array(
    z.instanceof(File, {
      message: "File ảnh không hợp lệ",
    }),
  )
  .min(1, "Phải upload ít nhất 1 ảnh")
  .max(4, "Tối đa 4 ảnh");

// reusable attributes
export const variantAttributesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number()]),
);

// base
const productVariantBaseSchema = z.object({
  productId: z.string().uuid("Sản phẩm không hợp lệ"),

  color: z
    .string()
    .trim()
    .min(1, "Màu sắc không được để trống")
    .max(50, "Màu sắc không được vượt quá 50 ký tự"),

  attributes: variantAttributesSchema.optional(),

  stock: z.coerce
    .number()
    .int("Tồn kho phải là số nguyên")
    .min(0, "Tồn kho không hợp lệ")
    .optional(),
});

// create
export const createProductVariantSchema = productVariantBaseSchema.extend({
  files: variantImagesSchema,
});

export type CreateProductVariantFormValues = z.input<
  typeof createProductVariantSchema
>;

export type CreateProductVariantFormOutput = z.output<
  typeof createProductVariantSchema
>;
