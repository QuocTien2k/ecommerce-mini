import type { z } from "zod";
import type { variantFormSchema } from "../schemas/product-variant.schema";

export const FASHION_SIZE_TYPES = {
  CLOTHING: "CLOTHING",
  SHOE: "SHOE",
} as const;

export type FashionSizeType =
  (typeof FASHION_SIZE_TYPES)[keyof typeof FASHION_SIZE_TYPES];

export type VariantFormValues = z.input<typeof variantFormSchema>;
