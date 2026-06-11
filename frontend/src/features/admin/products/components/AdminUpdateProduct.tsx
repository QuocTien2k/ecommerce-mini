import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAdminUpdateProductForm } from "../forms/use-admin-update-product-form";
import type { AdminProductListItem } from "../types/admin-product.type";
import { useAdminUpdateProduct } from "../hooks/useAdminUpdateProduct";
import { useAdminFlatCategoriesQuery } from "@features/admin/categories/hooks/useAdminCategoryFlatQuery";
import { useEffect, useState } from "react";
import type { UpdateProductFormOutput } from "../schemas/product.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { Trash2, Undo2, X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { toSlug } from "@/utils/toSlug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import { Controller, useWatch } from "react-hook-form";
import { useAdminBrandQuery } from "@features/admin/brands/hooks/useAdminBrandQuery";
import type { AdminBrandItem } from "@features/admin/brands/types/admin-brand.type";
import { getCategoryDisplayName } from "@/utils/category/category-display-name";
import { Editor } from "@components/editor/Editor";

type AdminUpdateProductProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  product: AdminProductListItem | null;
};

const AdminUpdateProduct = ({
  open,
  onOpenChange,
  product,
}: AdminUpdateProductProps) => {
  const form = useAdminUpdateProductForm();
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const { loading, run } = useScopedLoading();

  const updateProductMutation = useAdminUpdateProduct();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const categories = flatCategoriesQuery.data?.data ?? [];
  // console.log("Category dạng flat: ", categories);
  const categoriesReady =
    !flatCategoriesQuery.isLoading && categories.length > 0;

  const selectableCategories =
    flatCategoriesQuery.data?.data.filter((category) => category.level !== 1) ??
    [];

  const brandsQuery = useAdminBrandQuery();
  const brands: AdminBrandItem[] = brandsQuery.data?.data?.data ?? [];

  // watch
  const productName = form.watch("name");
  const discountValue = form.watch("discountPct");
  const thumbnailPreview = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  const previewUrl =
    (removeThumbnail ? product?.thumbnail : thumbnailPreview) ?? undefined;

  const toggleThumbnail = () => {
    setRemoveThumbnail((prev) => !prev);
  };

  // reset form when product changes
  useEffect(() => {
    if (!product || !open || !categoriesReady) return;
    //console.log("PRODUCT CATEGORY:", product.categoryId);

    setRemoveThumbnail(false);

    form.reset({
      name: product.name,
      description: product.description || "",
      thumbnail: product.thumbnail || "",

      price: Number(product.price),

      discountPct: product.discountPct ?? undefined,

      isActive: product.isActive,

      categoryId: product.categoryId,
      brandId: product.brandId,
    });
  }, [product, open, categoriesReady, form]);

  const handleClose = () => {
    form.clearErrors();

    onOpenChange(false);
  };

  const onSubmit = form.handleSubmit(
    async (values: UpdateProductFormOutput) => {
      if (!product || loading) return;

      sonnerToast.dismiss("product-update-error");

      try {
        const result = await run(() =>
          updateProductMutation.mutateAsync({
            id: product.id,

            data: {
              name: values.name || undefined,

              description: values.description || undefined,
              thumbnail: values.thumbnail || undefined,

              price: values.price,

              discountPct:
                values.discountPct === undefined || values.discountPct === null
                  ? values.discountPct
                  : Number(values.discountPct),

              isActive: values.isActive,

              categoryId: values.categoryId || undefined,
              brandId: values.brandId || undefined,
            },
          }),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Update product error:", error);

        sonnerToast.error(
          getErrorMessage(error, "Cập nhật sản phẩm thất bại"),
          {
            id: "product-update-error",
          },
        );
      }
    },
  );

  console.log("Data: ", product);

  if (!open || !product) return null;

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
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Cập nhật sản phẩm</h2>

            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* form */}
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

              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Editor value={field.value} onChange={field.onChange} />
                )}
              />

              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
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

              {form.formState.errors.thumbnail && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.thumbnail.message}
                </p>
              )}

              {thumbnailPreview?.startsWith("http") && (
                <div className="relative w-fit rounded-lg border bg-muted/20 p-2">
                  <img
                    src={previewUrl}
                    alt="Thumbnail preview"
                    className={`h-32 w-32 object-contain transition-opacity ${
                      removeThumbnail ? "opacity-40" : ""
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant={removeThumbnail ? "secondary" : "destructive"}
                    className="absolute right-1 top-1 z-20 h-7 w-7"
                    onClick={toggleThumbnail}
                  >
                    {removeThumbnail ? (
                      <Undo2 className="h-3.5 w-3.5" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>

                  {removeThumbnail && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50">
                      <span className="text-xs font-medium text-white">
                        Sẽ được thay thế
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* category */}
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                // console.log("field:", typeof field.value, field.value);

                // console.log(
                //   "category:",
                //   typeof categories[0]?.id,
                //   categories[0]?.id,
                // );

                return (
                  <div className="space-y-2">
                    <Label>Danh mục</Label>

                    <Select
                      key={field.value}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {categories.find((c) => c.id === field.value)?.name ||
                            "Chọn danh mục"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent position="popper">
                        {selectableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {"—".repeat(category.level - 1)}
                            {getCategoryDisplayName(category.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }}
            />

            {/* brand */}
            <Controller
              control={form.control}
              name="brandId"
              render={({ field }) => {
                return (
                  <div className="space-y-2">
                    <Label>Thương hiệu</Label>

                    <Select
                      key={field.value}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {brands.find((b) => b.id === field.value)?.name ||
                            "Chọn thương hiệu"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent position="popper">
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={String(brand.id)}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {form.formState.errors.brandId && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.brandId.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

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
                placeholder="Để trống nếu không giảm"
                value={typeof discountValue === "number" ? discountValue : ""}
                onChange={(e) => {
                  const value = e.target.value;

                  form.setValue(
                    "discountPct",
                    value === "" ? undefined : Number(value),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
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

          {/* actions */}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>

            <AsyncButton
              type="submit"
              loading={loading}
              disabled={loading}
              variant="edit"
            >
              Cập nhật sản phẩm
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateProduct;
