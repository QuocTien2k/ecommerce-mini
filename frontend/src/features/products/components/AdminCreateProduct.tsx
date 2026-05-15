import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useEffect, useRef, useState } from "react";
import { useCreateProductForm } from "../forms/use-create-product-form";
import { useAdminFlatCategoriesQuery } from "@features/categories/hooks/useAdminCategoryFlatQuery";
import { useAdminCreateProduct } from "../hooks/useAdminCreateProduct";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { ImagePlus, X } from "lucide-react";
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

type CreateProductFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateProductForm = ({
  open,
  onClose,
}: CreateProductFormProps) => {
  const form = useCreateProductForm();

  const { loading, run } = useScopedLoading();

  const createProductMutation = useAdminCreateProduct();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // preview slug
  const productName = form.watch("name");

  // watch files
  const selectedFiles = form.watch("files");

  // preview first image
  useEffect(() => {
    if (!selectedFiles?.length) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFiles[0]);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFiles]);

  const handleClose = () => {
    form.reset();

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (loading) return;

    sonnerToast.dismiss("product-create-error");

    try {
      const result = await run(() =>
        createProductMutation.mutateAsync({
          product: {
            name: values.name,
            slug: values.slug || undefined,
            description: values.description || undefined,
            price: values.price,
            discountPct: values.discountPct || undefined,
            isActive: values.isActive,
            categoryId: values.categoryId,
          },

          variant: {
            color: values.color,
            stock: values.stock,
            attributes: values.attributes,
          },

          files: values.files,
        }),
      );

      handleClose();

      sonnerToast.success(result.product.message);
    } catch (error) {
      console.error("Create product error:", error);

      sonnerToast.error(getErrorMessage(error, "Tạo sản phẩm thất bại"), {
        id: "product-create-error",
      });
    }
  });

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

            {/* color */}
            <div className="space-y-2">
              <Label>Màu sắc</Label>

              <Input
                placeholder="Ví dụ: Đen, Trắng..."
                {...form.register("color")}
              />

              {form.formState.errors.color && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>

            {/* size */}
            <div className="space-y-2">
              <Label>Size</Label>

              <Select
                value={form.watch("attributes.size") || ""}
                onValueChange={(value) =>
                  form.setValue("attributes.size", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn size" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
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

            {/* stock */}
            <div className="space-y-2">
              <Label>Tồn kho</Label>

              <Input
                type="number"
                min={0}
                placeholder="0"
                {...form.register("stock")}
              />

              {form.formState.errors.stock && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* images */}
          <div className="space-y-3">
            <Label>Ảnh sản phẩm</Label>

            <input
              ref={fileInputRef}
              id="product-image"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                form.setValue("files", files, {
                  shouldValidate: true,
                });
              }}
            />

            <div className="flex items-center gap-4">
              <Label
                htmlFor="product-image"
                className="
                flex size-28 cursor-pointer items-center justify-center
                overflow-hidden rounded-lg border border-dashed
                bg-muted transition hover:bg-muted/80
              "
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <ImagePlus className="size-6" />
                  </div>
                )}
              </Label>

              <div className="space-y-1">
                <Label
                  htmlFor="product-image"
                  className="
                  cursor-pointer text-sm font-medium
                  text-blue-500 hover:underline
                "
                >
                  Chọn ảnh sản phẩm
                </Label>

                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP - tối đa 5MB
                </p>

                {!!selectedFiles.length && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Đã chọn {selectedFiles.length} ảnh
                    </p>

                    <p className="max-w-60 truncate text-xs text-muted-foreground">
                      {selectedFiles[0].name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {form.formState.errors.files && (
              <p className="text-sm text-red-500">
                {form.formState.errors.files.message}
              </p>
            )}
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
