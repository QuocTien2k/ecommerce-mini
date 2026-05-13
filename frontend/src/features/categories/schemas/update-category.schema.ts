import z from "zod";
import { createCategorySchema } from "./create-category.schema";

export const updateCategorySchema = createCategorySchema.extend({
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File phải là hình ảnh",
    )
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB"),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
