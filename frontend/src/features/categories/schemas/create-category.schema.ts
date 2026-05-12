import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),

  slug: z.string().optional(),

  description: z.string().optional(),

  parentId: z.string().optional(),

  isActive: z.boolean(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
