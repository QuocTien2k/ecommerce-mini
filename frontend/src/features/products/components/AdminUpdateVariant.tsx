import { useEffect, useRef, useState } from "react";
import { useAdminUpdateVariantForm } from "../forms/use-admin-update-vairant-form";
import { useAdminUpdateVariant } from "../hooks/useAdminUpdateVariant";
import type { AdminVariantResponse } from "../types/admin-variant.type";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import type { UpdateProductVariantFormOutput } from "../schemas/product-variant.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { ImagePlus, Trash2, Undo2, X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { AsyncButton } from "@components/common/async-button";
import { cn } from "@lib/utils";
import { useWatch } from "react-hook-form";
import type { VariantType } from "@features/categories/types/admin-category.type";
import { VariantFieldRenderer } from "./vairant-render/Variant-Field-Render";

type AdminUpdateVariantProps = {
  open: boolean;
  onClose: () => void;

  productId: string;
  variant: AdminVariantResponse;
  variantType: VariantType;
};

const AdminUpdateVariant = ({
  open,
  onClose,
  productId,
  variant,
  variantType,
}: AdminUpdateVariantProps) => {
  const form = useAdminUpdateVariantForm(variant);

  const { loading, run } = useScopedLoading();

  const updateVariantMutation = useAdminUpdateVariant();

  const fileInputRef = useRef<HTMLInputElement>(null);

  //   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>(
    [],
  );

  const selectedFiles = useWatch({
    control: form.control,
    name: "files",
  });

  // sync removeImagePublicIds
  useEffect(() => {
    form.setValue("removeImagePublicIds", removedImagePublicIds, {
      shouldValidate: true,
    });
  }, [removedImagePublicIds, form]);

  const handleClose = () => {
    form.reset({
      color: variant.color,

      attributes: variant.attributes || {},

      stock: variant.stock,

      files: [],

      removeImagePublicIds: [],
    });

    form.clearErrors();

    //setPreviewUrls([]);
    setRemovedImagePublicIds([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const handleRemoveOldImage = (publicId: string) => {
    setRemovedImagePublicIds((prev) => {
      if (prev.includes(publicId)) {
        return prev.filter((id) => id !== publicId);
      }

      return [...prev, publicId];
    });
  };

  const remainingOldImages = variant.images.filter(
    (_, index) =>
      !removedImagePublicIds.includes(variant.imagePublicIds[index]),
  );

  const totalImages = remainingOldImages.length + (selectedFiles?.length || 0);

  const onSubmit = form.handleSubmit(
    async (values: UpdateProductVariantFormOutput) => {
      if (loading) return;

      sonnerToast.dismiss("update-variant-error");

      try {
        if (totalImages === 0) {
          sonnerToast.error("Biến thể phải có ít nhất 1 ảnh", {
            id: "update-variant-error",
          });

          return;
        }

        const result = await run(() =>
          updateVariantMutation.mutateAsync({
            id: variant.id,
            productId,

            data: {
              color: values.color,

              attributes: values.attributes,

              stock: values.stock,

              removeImagePublicIds: values.removeImagePublicIds,
            },

            files: values.files,
          }),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Update product variant error:", error);

        sonnerToast.error(
          getErrorMessage(error, "Cập nhật biến thể thất bại"),
          {
            id: "update-variant-error",
          },
        );
      }
    },
    (errors) => {
      console.log(errors);
    },
  );

  if (!open || !variant) return null;

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
          <h2 className="text-lg font-semibold">Cập nhật chi tiết sản phẩm</h2>

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
          {/* variant info */}
          <div className="grid grid-cols-1 gap-5">
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

            <VariantFieldRenderer variantType={variantType} form={form} />

            {/* stock */}
            <div className="space-y-2">
              <Label>Tồn kho</Label>

              <Input
                type="number"
                min={0}
                placeholder="0"
                {...form.register("stock", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.stock && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* old images */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Ảnh hiện tại</Label>

              <p className="text-xs text-muted-foreground">Chọn ảnh để xóa</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {variant.images.map((image, index) => {
                const publicId = variant.imagePublicIds[index];

                const removed = removedImagePublicIds.includes(publicId);

                return (
                  <div key={publicId} className="relative">
                    <img
                      src={image}
                      alt={`Variant ${index + 1}`}
                      className={cn(
                        "size-28 rounded-lg border object-cover transition",
                        removed && "opacity-40 grayscale",
                      )}
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant={removed ? "default" : "destructive"}
                      className="absolute right-1 top-1 size-7"
                      onClick={() => handleRemoveOldImage(publicId)}
                    >
                      {removed ? (
                        <Undo2 className="size-4" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* upload new images */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Thêm ảnh mới</Label>

              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP - tối đa 2 ảnh
              </p>
            </div>

            <input
              ref={fileInputRef}
              id="update-variant-images"
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

            <div className="flex flex-wrap items-center gap-4">
              <Label
                htmlFor="update-variant-images"
                className="
                  flex size-28 cursor-pointer items-center
                  justify-center overflow-hidden
                  rounded-lg border border-dashed
                  bg-muted transition hover:bg-muted/80
                "
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImagePlus className="size-6" />
                </div>
              </Label>
              {selectedFiles?.map((file, index) => (
                <img
                  key={`${file.name}-${index}`}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="size-28 rounded-lg border object-cover"
                />
              ))}
            </div>

            {!!selectedFiles?.length && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Đã chọn {selectedFiles.length} ảnh
                </p>

                {selectedFiles.map((file) => (
                  <p
                    key={file.name}
                    className="max-w-60 truncate text-xs text-muted-foreground"
                  >
                    {file.name}
                  </p>
                ))}
              </div>
            )}

            {form.formState.errors.files && (
              <p className="text-sm text-red-500">
                {form.formState.errors.files.message}
              </p>
            )}
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button type="button" variant="destructive" onClick={handleClose}>
              Hủy
            </Button>

            <AsyncButton type="submit" loading={loading} disabled={loading}>
              Cập nhật variant
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateVariant;
