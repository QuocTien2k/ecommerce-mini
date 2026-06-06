import type { VariantType } from "@features/admin/categories/types/admin-category.type";
import SizeColor from "./SizeColor";
import { type UseFormReturn } from "react-hook-form";
import Storage from "./Storage";

type VariantFormValues = {
  attributes?: Record<string, string | number>;
};

type Props<T extends VariantFormValues> = {
  variantType: VariantType;
  form: UseFormReturn<T>;
};

export const VariantFieldRenderer = <T extends VariantFormValues>({
  variantType,
  form,
}: Props<T>) => {
  switch (variantType) {
    case "SIZE_COLOR":
      return <SizeColor form={form} />;

    case "STORAGE":
      return <Storage form={form} />;

    case "SPEC":
      return <Spec form={form} />;

    case "SWITCH":
      return <Switch form={form} />;

    case "CUSTOM":
      return <Custom form={form} />;

    case "NONE":
    default:
      return null;
  }
};
