import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAdminUpdateProductForm } from "../forms/use-admin-update-product-form";
import type { AdminProductListItem } from "../types/admin-product.type";
import { useAdminUpdateProduct } from "../hooks/useAdminUpdateProduct";
import { useAdminFlatCategoriesQuery } from "@features/categories/hooks/useAdminCategoryFlatQuery";
import { useEffect } from "react";
import type { UpdateProductFormOutput } from "../schemas/product.schema";
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
import { Controller } from "react-hook-form";

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

  const { loading, run } = useScopedLoading();

  const updateProductMutation = useAdminUpdateProduct();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const categories = flatCategoriesQuery.data?.data ?? [];
  console.log("Category dạng flat: ", categories);
  const categoriesReady =
    !flatCategoriesQuery.isLoading && categories.length > 0;

  // watch
  const productName = form.watch("name");
  const discountValue = form.watch("discountPct");

  // reset form when product changes
  useEffect(() => {
    if (!product || !open || !categoriesReady) return;
    console.log("PRODUCT CATEGORY:", product.categoryId);
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description || "",

      price: Number(product.price),

      discountPct: product.discountPct ?? undefined,

      isActive: product.isActive,

      categoryId: product.categoryId,
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

              slug: values.slug || undefined,

              description: values.description || undefined,

              price: values.price,

              discountPct:
                values.discountPct === undefined || values.discountPct === null
                  ? values.discountPct
                  : Number(values.discountPct),

              isActive: values.isActive,

              categoryId: values.categoryId || undefined,
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

            {/* slug */}
            <div className="space-y-2 md:col-span-2">
              <Label>Slug</Label>

              <Input placeholder="product-slug" {...form.register("slug")} />

              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.slug.message}
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
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                console.log("field:", typeof field.value, field.value);

                console.log(
                  "category:",
                  typeof categories[0]?.id,
                  categories[0]?.id,
                );

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
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
