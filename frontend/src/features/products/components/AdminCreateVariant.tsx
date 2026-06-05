import { Button } from "@components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminCreateVariantForm } from "../forms/use-admin-create-variant-form";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAdminCreateVariant } from "../hooks/useAdminCreateProduct";
import type { CreateProductVariantFormOutput } from "../schemas/product-variant.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { AsyncButton } from "@components/common/async-button";
import type { VariantType } from "@features/categories/types/admin-category.type";
import { VariantFieldRenderer } from "./vairant-render/Variant-Field-Render";

type CreateVariantFormProp = {
  open: boolean;
  onClose: () => void;
  productId: string;
  variantType: VariantType;
};

const AdminCreateVariant = ({
  open,
  onClose,
  productId,
  variantType,
}: CreateVariantFormProp) => {
  const form = useAdminCreateVariantForm();
  const { loading, run } = useScopedLoading();

  const createVariantMutation = useAdminCreateVariant();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"upload" | "url">("upload");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");

  // watch files
  const selectedFiles = form.watch("files");
  const imageUrls = form.watch("imageUrls");

  //preview file ảnh
  useEffect(() => {
    if (selectedFiles?.length) {
      const url = URL.createObjectURL(selectedFiles[0]);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    if (imageUrls?.length) {
      setPreviewUrl(imageUrls[0]);
      return;
    }

    setPreviewUrl(null);
  }, [selectedFiles, imageUrls]);

  useEffect(() => {
    if (imageSource === "upload") {
      form.setValue("imageUrls", []);
      return;
    }

    form.setValue("files", []);
  }, [imageSource, form]);

  const handleClose = () => {
    form.reset();
    form.clearErrors();

    setImageUrl1("");
    setImageUrl2("");

    setPreviewUrl(null);
    setImageSource("upload");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const onSubmit = form.handleSubmit(
    async (values: CreateProductVariantFormOutput) => {
      //console.log("SUBMIT");
      if (loading) return;

      sonnerToast.dismiss("create-variant-error");

      try {
        const result = await run(() =>
          createVariantMutation.mutateAsync({
            data: {
              productId,
              color: values.color,
              attributes: values.attributes,
              stock: values.stock,
              imageUrls: values.imageUrls?.length
                ? values.imageUrls
                : undefined,
            },

            files: values.files ?? [],
          }),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Create product variant error:", error);

        sonnerToast.error(
          getErrorMessage(error, "Tạo chi tiết sản phẩm thất bại"),
          {
            id: "create-variant-error",
          },
        );
      }
    },
  );

  //handle value input path
  const syncImageUrls = (url1: string, url2: string) => {
    const urls = [url1, url2].map((url) => url.trim()).filter(Boolean);

    form.setValue("imageUrls", urls, {
      shouldValidate: true,
    });
  };

  if (!open || !productId) return null;

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
          <h2 className="text-lg font-semibold">Tạo chi tiết sản phẩm</h2>

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

          {/* image source */}
          <div className="space-y-2">
            <Label>Nguồn ảnh</Label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={imageSource === "upload"}
                  onChange={() => setImageSource("upload")}
                />

                <span>Upload ảnh</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={imageSource === "url"}
                  onChange={() => setImageSource("url")}
                />

                <span>Dán URL ảnh</span>
              </label>
            </div>
          </div>

          {/* upload images */}
          {imageSource === "upload" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Ảnh variant</Label>

                <p className="text-xs text-muted-foreground">
                  Upload từ 1 đến 2 ảnh
                </p>
              </div>

              <input
                ref={fileInputRef}
                id="variant-images"
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
                  htmlFor="variant-images"
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
                    htmlFor="variant-images"
                    className="
            cursor-pointer text-sm font-medium
            text-blue-500 hover:underline
          "
                  >
                    Chọn ảnh
                  </Label>

                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP - tối đa 2 ảnh
                  </p>

                  {!!selectedFiles?.length && (
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
          )}

          {imageSource === "url" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>URL ảnh</Label>

                <p className="text-xs text-muted-foreground">
                  Tối đa 2 URL ảnh
                </p>
              </div>

              <Input
                placeholder="https://example.com/image-1.jpg"
                value={imageUrl1}
                onChange={(e) => {
                  const value = e.target.value;

                  setImageUrl1(value);
                  syncImageUrls(value, imageUrl2);
                }}
              />

              <Input
                placeholder="https://example.com/image-2.jpg"
                value={imageUrl2}
                onChange={(e) => {
                  const value = e.target.value;

                  setImageUrl2(value);
                  syncImageUrls(imageUrl1, value);
                }}
              />

              {previewUrl && (
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-28 w-28 object-cover"
                  />
                </div>
              )}

              {form.formState.errors.imageUrls && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.imageUrls.message}
                </p>
              )}

              {form.formState.errors.files && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.files.message}
                </p>
              )}
            </div>
          )}

          {/* actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button variant="destructive" onClick={handleClose}>
              Hủy
            </Button>

            <AsyncButton type="submit" loading={loading} disabled={loading}>
              Tạo variant
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateVariant;
