import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),

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
