import { Input } from "@components/ui/input";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";

type VariantFormValues = {
  attributes?: Record<string, string | number>;
};

type VariantFieldProps<T extends VariantFormValues> = {
  form: UseFormReturn<T>;
};

const STORAGE_PRESETS = [
  "32GB",
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
  "2TB",
  "4TB",
];

const Storage = <T extends VariantFormValues>({
  form,
}: VariantFieldProps<T>) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Dung lượng</p>

        <Input
          placeholder="Ví dụ: 256GB, 1TB, 4TB"
          {...form.register("attributes.storage" as Path<T>)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STORAGE_PRESETS.map((storage) => (
          <button
            key={storage}
            type="button"
            onClick={() =>
              form.setValue("attributes.storage" as Path<T>, storage as never, {
                shouldDirty: true,
              })
            }
            className="rounded-md border px-3 py-1 text-sm transition hover:bg-muted cursor-pointer"
          >
            {storage}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Storage;
