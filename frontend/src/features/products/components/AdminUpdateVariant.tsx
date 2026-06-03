import { useEffect, useRef, useState } from "react";
import { useAdminUpdateVariantForm } from "../forms/use-admin-update-vairant-form";
import { useAdminUpdateVariant } from "../hooks/useAdminUpdateProduct";
import type { AdminVariantResponse } from "../types/admin-variant.type";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import type { UpdateProductVariantFormOutput } from "../schemas/product-variant.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { AsyncButton } from "@components/common/async-button";
import type { VariantType } from "@features/categories/types/admin-category.type";
import { VariantFieldRenderer } from "./vairant-render/Variant-Field-Render";
import { VariantUpdateImageManager } from "./VariantUpdateIamge";

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

  const files = form.watch("files") ?? [];

  const imageUrls = form.watch("imageUrls") ?? variant.images;

  const removeImagePublicIds = form.watch("removeImagePublicIds") ?? [];

  /* close handler */
  const handleClose = () => {
    form.reset({
      color: variant.color,
      attributes: variant.attributes || {},
      stock: variant.stock,
      files: undefined,
      imageUrls: undefined,
      removeImagePublicIds: [],
    });

    form.clearErrors();

    onClose();
  };

  /* submit */
  const onSubmit = form.handleSubmit(
    async (values: UpdateProductVariantFormOutput) => {
      if (loading) return;

      console.log("submit data", values);
      console.log("imageUrls", values.imageUrls);
      console.log("isArray", Array.isArray(values.imageUrls));

      sonnerToast.dismiss("update-variant-error");

      try {
        const result = await run(() =>
          updateVariantMutation.mutateAsync({
            id: variant.id,
            productId,
            data: {
              color: values.color,
              attributes: values.attributes,
              stock: values.stock,
              removeImagePublicIds: values.removeImagePublicIds,
              imageUrls: values.imageUrls,
            },
            files: values.files ?? [],
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
  );

  if (!open || !variant) return null;

  //console.log(variant);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật variant</h2>

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
          {/* BASIC INFO */}
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <Input {...form.register("color")} />
              {form.formState.errors.color && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>

            <VariantFieldRenderer variantType={variantType} form={form} />

            <div className="space-y-2">
              <Label>Tồn kho</Label>
              <Input
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
              />
              {form.formState.errors.stock && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <VariantUpdateImageManager
            variant={variant}
            files={files}
            imageUrls={imageUrls}
            removeImagePublicIds={removeImagePublicIds}
            onFilesChange={(files) =>
              form.setValue("files", files, {
                shouldValidate: true,
              })
            }
            onImageUrlsChange={(urls) =>
              form.setValue("imageUrls", urls, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            onRemoveImagePublicIdsChange={(ids) =>
              form.setValue("removeImagePublicIds", ids, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />

          {/* actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant={"destructive"} type="button" onClick={handleClose}>
              Hủy
            </Button>

            <AsyncButton type="submit" loading={loading}>
              Cập nhật
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateVariant;
