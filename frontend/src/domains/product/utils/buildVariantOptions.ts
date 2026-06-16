import type { PublicProductVariant } from "../types/public-product.type";

export type VariantOptions = {
  colors: string[];
  attributes: Record<string, string[]>;
};

export const buildVariantOptions = (
  variants: PublicProductVariant[],
): VariantOptions => {
  const colorSet = new Set<string>();

  const attributeMap = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    colorSet.add(variant.color);

    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!attributeMap.has(key)) {
        attributeMap.set(key, new Set());
      }

      attributeMap.get(key)?.add(value);
    });
  });

  return {
    colors: [...colorSet],

    attributes: Object.fromEntries(
      [...attributeMap.entries()].map(([key, values]) => [key, [...values]]),
    ),
  };
};

export const findVariantBySelection = (
  variants: PublicProductVariant[],
  color?: string,
  attributes?: Record<string, string>,
) => {
  return variants.find((variant) => {
    const colorMatched = !color || variant.color === color;

    const attributeMatched =
      !attributes ||
      Object.entries(attributes).every(
        ([key, value]) => variant.attributes[key] === value,
      );

    return colorMatched && attributeMatched;
  });
};

//support UI
export const getDefaultVariantSelection = (
  variants: PublicProductVariant[],
) => {
  const firstVariant = variants[0];

  if (!firstVariant) {
    return {
      color: undefined,
      attributes: {},
    };
  }

  return {
    color: firstVariant.color,
    attributes: firstVariant.attributes,
  };
};
