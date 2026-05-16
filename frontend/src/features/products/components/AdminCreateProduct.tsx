import { useScopedLoading } from "@/hooks/use-scoped-loading";

import { useAdminFlatCategoriesQuery } from "@features/categories/hooks/useAdminCategoryFlatQuery";
import { useAdminCreateProduct } from "../hooks/useAdminCreateProduct";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { toSlug } from "@/utils/toSlug";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import type { CreateProductFormOutput } from "../schemas/product.schema";
import { useAdminCreateProductForm } from "../forms/use-admin-create-product-form";

type CreateProductFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateProductForm = ({
  open,
  onClose,
}: CreateProductFormProps) => {
  const form = useAdminCreateProductForm();

  const { loading, run } = useScopedLoading();

  const createProductMutation = useAdminCreateProduct();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  // preview slug
  const productName = form.watch("name");

  const handleClose = () => {
    form.reset();
    form.clearErrors();

    onClose();
  };

  const onSubmit = form.handleSubmit(
    async (values: CreateProductFormOutput) => {
      if (loading) return;

      sonnerToast.dismiss("product-create-error");

      try {
        const result = await run(() =>
          createProductMutation.mutateAsync({
            name: values.name,
            slug: values.slug || undefined,
            description: values.description || undefined,
            price: values.price,
            discountPct: values.discountPct || undefined,
            isActive: values.isActive,
            categoryId: values.categoryId,
          }),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Create product error:", error);

        sonnerToast.error(getErrorMessage(error, "Tạo sản phẩm thất bại"), {
          id: "product-create-error",
        });
      }
    },
  );

  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0 z-50
      flex items-center justify-center
      backdrop-blur-sm
      p-4
    "
      onClick={handleClose}
    >
      <div
        className="
        max-h-[95vh] w-full max-w-4xl overflow-y-auto
        rounded-2xl
        border border-white/10
        bg-white
        p-6
        shadow-2xl
      "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tạo sản phẩm</h2>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* product info */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* name */}
            <div className="space-y-2 md:col-span-2">
              <Label>Tên sản phẩm</Label>

              <Input
                placeholder="Nhập tên sản phẩm..."
                {...form.register("name")}
              />

              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}

              {productName && (
                <p className="text-[14px] text-blue-500">
                  Slug preview: {toSlug(productName)}
                </p>
              )}
            </div>

            {/* description */}
            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả</Label>

              <Textarea
                placeholder="Mô tả sản phẩm..."
                {...form.register("description")}
              />

              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* category */}
            <div className="space-y-2">
              <Label>Danh mục</Label>

              <Select
                value={form.watch("categoryId")}
                onValueChange={(value) =>
                  form.setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>

                <SelectContent
                  className="max-h-72 p-2 text-black/50"
                  position="popper"
                >
                  {flatCategoriesQuery.data?.data?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {"— ".repeat(category.level - 1)}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.formState.errors.categoryId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            {/* price */}
            <div className="space-y-2">
              <Label>Giá sản phẩm</Label>

              <Input
                type="number"
                min={0}
                placeholder="0"
                {...form.register("price")}
              />

              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            {/* discount */}
            <div className="space-y-2">
              <Label>Giảm giá (%)</Label>

              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                {...form.register("discountPct")}
              />

              {form.formState.errors.discountPct && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.discountPct.message}
                </p>
              )}
            </div>
          </div>

          {/* active */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={form.watch("isActive")}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
              className="
              cursor-pointer
              border-emerald-500
              data-[state=checked]:border-emerald-500
              data-[state=checked]:bg-emerald-500
              data-[state=checked]:text-white
            "
            />

            <Label>Hiển thị sản phẩm</Label>
          </div>

          <AsyncButton type="submit" loading={loading} disabled={loading}>
            Tạo sản phẩm
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};
