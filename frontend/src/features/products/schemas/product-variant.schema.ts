import { z } from "zod";

// reusable image
export const variantImagesSchema = z
  .array(
    z.instanceof(File, {
      message: "File ảnh không hợp lệ",
    }),
  )
  .max(2, "Tối đa 2 ảnh");

// reusable image urls
export const variantImageUrlsSchema = z
  .array(z.string().url("URL ảnh không hợp lệ"))
  .max(2, "Tối đa 2 ảnh");

// reusable attributes
export const variantAttributesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number()]),
);

// base
const productVariantBaseSchema = z.object({
  color: z
    .string()
    .trim()
    .min(1, "Màu sắc không được để trống")
    .max(50, "Màu sắc không được vượt quá 50 ký tự"),

  attributes: variantAttributesSchema.optional(),

  stock: z.coerce
    .number()
    .int("Tồn kho phải là số nguyên")
    .min(1, "Tồn kho không hợp lệ")
    .optional(),
});

// shared form schema
export const variantFormSchema = productVariantBaseSchema.extend({
  files: z.array(z.instanceof(File)).optional(),
  imageUrls: variantImageUrlsSchema.optional(),
  removeImagePublicIds: z.array(z.string()).optional(),
});

// create
export const createProductVariantSchema = variantFormSchema
  .extend({})
  .superRefine((data, ctx) => {
    const hasFiles = (data.files?.length ?? 0) > 0;
    const hasImageUrls = (data.imageUrls?.length ?? 0) > 0;

    if (!hasFiles && !hasImageUrls) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["files"],
        message: "Phải upload ảnh hoặc cung cấp URL ảnh",
      });
    }

    if (hasFiles && hasImageUrls) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["files"],
        message:
          "Chỉ được upload ảnh hoặc cung cấp URL ảnh, không được dùng đồng thời",
      });
    }
  });

export type CreateProductVariantFormValues = z.input<
  typeof createProductVariantSchema
>;

export type CreateProductVariantFormOutput = z.output<
  typeof createProductVariantSchema
>;

// update
export const updateProductVariantSchema = variantFormSchema.extend({
  files: z.array(z.instanceof(File)).max(2, "Tối đa 2 ảnh").optional(),

  removeImagePublicIds: z.array(z.string()).optional(),
});
export type UpdateProductVariantFormValues = z.input<
  typeof updateProductVariantSchema
>;

export type UpdateProductVariantFormOutput = z.output<
  typeof updateProductVariantSchema
>;
