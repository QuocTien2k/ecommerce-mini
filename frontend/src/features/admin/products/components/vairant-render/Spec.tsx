import { Input } from "@components/ui/input";
import { type Path, type UseFormReturn } from "react-hook-form";

type VariantFormValues = {
  attributes?: Record<string, string | number>;
};

type VariantFieldProps<T extends VariantFormValues> = {
  form: UseFormReturn<T>;
};

const Spec = <T extends VariantFormValues>({ form }: VariantFieldProps<T>) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">CPU</p>

        <Input
          placeholder="Ví dụ: Intel Core i5-13420H"
          {...form.register("attributes.cpu" as Path<T>)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">RAM</p>

        <Input
          placeholder="Ví dụ: 16GB DDR5"
          {...form.register("attributes.ram" as Path<T>)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">SSD</p>

        <Input
          placeholder="Ví dụ: 512GB NVMe"
          {...form.register("attributes.ssd" as Path<T>)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">GPU</p>

        <Input
          placeholder="Ví dụ: RTX 4060"
          {...form.register("attributes.gpu" as Path<T>)}
        />
      </div>
    </div>
  );
};

export default Spec;
