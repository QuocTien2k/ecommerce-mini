import z from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên thương hiệu tối thiểu 2 ký tự")
    .max(60, "Tên thương hiệu tối đa 60 ký tự"),

  isActive: z.boolean(),
});

export const updateBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên thương hiệu tối thiểu 2 ký tự")
    .max(60, "Tên thương hiệu tối đa 60 ký tự")
    .optional(),

  isActive: z.boolean().optional(),
});

export type CreateBrandSchema = z.infer<typeof createBrandSchema>;
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;
