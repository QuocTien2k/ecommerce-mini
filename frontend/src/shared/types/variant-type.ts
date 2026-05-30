import {
  VARIANT_TYPES,
  type VariantType,
} from "@features/categories/types/admin-category.type";

export const variantTypeLabels: Record<VariantType, string> = {
  NONE: "Không có variant",
  SIZE_COLOR: "Size + màu sắc",
  STORAGE: "Dung lượng",
  SPEC: "Cấu hình",
  SWITCH: "Switch",
  CUSTOM: "Tùy chỉnh",
};

export const variantTypeOptions = Object.values(VARIANT_TYPES).map((value) => ({
  value,
  label: variantTypeLabels[value],
}));

export const ATTRIBUTE_LABELS: Record<string, string> = {
  size: "Size",
  color: "Màu sắc",
  storage: "Dung lượng",
  cpu: "CPU",
  ram: "RAM",
  gpu: "GPU",
  switch: "Switch",
};
