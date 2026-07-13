import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAdminFlatCategoriesQuery } from "@features/admin/categories/hooks/useAdminCategoryFlatQuery";
import { useAdminCreateProduct } from "../hooks/useAdminCreateProduct";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { toSlug } from "@/utils/toSlug";
import { Controller, useWatch } from "react-hook-form";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import type { CreateProductFormOutput } from "../schemas/product.schema";
import { useAdminCreateProductForm } from "../forms/use-admin-create-product-form";
import { useAdminBrandQuery } from "@features/admin/brands/hooks/useAdminBrandQuery";
import type { AdminBrandItem } from "@features/admin/brands/types/admin-brand.type";
import { Editor } from "@components/editor/Editor";
import { useEffect, useState } from "react";
import { ProductBrandCombobox } from "./combobox/ProductBrandCombobox";
import { FieldError } from "@components/ui/field-error";
import { CategoryCombobox } from "@features/admin/categories/components/CategoryCombobox";

type CreateProductFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateProductForm = ({
  open,
  onClose,
}: CreateProductFormProps) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  const form = useAdminCreateProductForm();

  const { loading, run } = useScopedLoading();

  const createProductMutation = useAdminCreateProduct();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const selectableCategories =
    flatCategoriesQuery.data?.data.filter((category) => category.level === 3) ??
    [];

  const brandsQuery = useAdminBrandQuery();
  const brands: AdminBrandItem[] = (brandsQuery.data?.data?.data ?? []).filter(
    (brand) => brand.isActive === true,
  );

  //console.log("Brand: ", brands);

  const thumbnailPreview = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  // Reset image error when thumbnail URL changes
  useEffect(() => {
    setThumbnailError(false);
  }, [thumbnailPreview]);

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
            description: values.description || undefined,
            thumbnail: values.thumbnail,
            price: values.price,
            discountPct: values.discountPct || undefined,
            isActive: values.isActive,
            categoryId: values.categoryId,
            brandId: values.brandId,
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

              <FieldError error={form.formState.errors.name} />

              {productName && (
                <p className="text-[14px] text-blue-500">
                  Slug preview: {toSlug(productName)}
                </p>
              )}
            </div>

            {/* description */}
            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả</Label>
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Editor value={field.value} onChange={field.onChange} />
                )}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}{" "}
                </p>
              )}
            </div>

            {/* thumbnail */}
            <div className="space-y-2 md:col-span-2">
              <Label>Thumbnail</Label>

              <Input
                placeholder="https://example.com/image.jpg"
                {...form.register("thumbnail")}
              />

              <FieldError error={form.formState.errors.thumbnail} />

              {thumbnailPreview?.startsWith("http") && !thumbnailError && (
                <div className="w-fit rounded-lg border bg-muted/20 p-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-32 w-32 object-contain"
                    onError={() => setThumbnailError(true)}
                  />
                </div>
              )}

              {thumbnailError && (
                <p className="text-sm text-red-500">
                  Không thể tải ảnh từ URL này
                </p>
              )}
            </div>

            {/* category */}
            <div className="space-y-2">
              <Label>Danh mục</Label>

              <CategoryCombobox
                categories={selectableCategories}
                value={form.watch("categoryId")}
                onChange={(value) => {
                  if (!value) return;

                  form.setValue("categoryId", value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FieldError error={form.formState.errors.categoryId} />
            </div>

            {/* brand */}
            <div className="space-y-2">
              <Label>Thương hiệu</Label>

              <ProductBrandCombobox
                brands={brands}
                loading={brandsQuery.isLoading}
                value={form.watch("brandId")}
                onChange={(value) =>
                  form.setValue("brandId", value, {
                    shouldValidate: true,
                  })
                }
              />

              <FieldError error={form.formState.errors.brandId} />
            </div>

            {/* price */}
            <div className="space-y-2">
              <Label>Giá sản phẩm</Label>

              <Input
                type="number"
                placeholder="Nhập giá sản phẩm..."
                {...form.register("price", {
                  setValueAs: (value) => {
                    if (value === "" || value === null || value === undefined) {
                      return undefined;
                    }
                    const num = Number(value);
                    return isNaN(num) ? undefined : Math.floor(num); // đảm bảo số nguyên
                  },
                })}
              />

              <FieldError error={form.formState.errors.price} />
            </div>

            {/* discount */}
            <div className="space-y-2">
              <Label>Giảm giá (%)</Label>

              <Input
                type="number"
                placeholder="0"
                {...form.register("discountPct", {
                  setValueAs: (value) =>
                    value === "" || value == null ? undefined : Number(value),
                })}
              />

              <FieldError error={form.formState.errors.discountPct} />
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
