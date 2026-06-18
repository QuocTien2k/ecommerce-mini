import { ATTRIBUTE_LABELS } from "@shared/types/variant-type";

export function formatProductAttributes(
  attributes?: Record<string, any> | string,
): string {
  if (!attributes) return "";

  let parsed: Record<string, any>;

  // handle case BE trả string JSON
  if (typeof attributes === "string") {
    try {
      parsed = JSON.parse(attributes);
    } catch {
      return ""; // hoặc fallback attributes raw
    }
  } else {
    parsed = attributes;
  }

  return Object.entries(parsed)
    .map(([key, value]) => {
      const label = ATTRIBUTE_LABELS[key] ?? key;
      return `${label}: ${value}`;
    })
    .join(", ");
}
