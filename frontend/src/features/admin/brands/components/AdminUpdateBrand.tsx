import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useUpdateBrandForm } from "../forms/use-update-brand-form";
import type { AdminBrandItem } from "../types/admin-brand.type";
import { useAdminUpdateBrand } from "../hooks/useAdminUpdateBrand";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Trash2, Undo2, X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import { useWatch } from "react-hook-form";

type UpdateBrandFormProps = {
  open: boolean;
  onClose: () => void;
  brand: AdminBrandItem | null;
};

const AdminUpdateBrand = ({ open, onClose, brand }: UpdateBrandFormProps) => {
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const form = useUpdateBrandForm();

  const { loading, run } = useScopedLoading();
  const updateMutation = useAdminUpdateBrand();
  const isActive = form.watch("isActive");
  const thumbnailPreview = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  const previewUrl =
    (removeThumbnail ? brand?.thumbnail : thumbnailPreview) ?? undefined;

  const toggleThumbnail = () => {
    setRemoveThumbnail((prev) => !prev);
  };

  const handleClose = () => {
    form.reset({
      name: brand?.name ?? "",
      thumbnail: brand?.thumbnail ?? "",
      isActive: brand?.isActive ?? true,
    });

    onClose();
  };

  useEffect(() => {
    if (brand && open) {
      form.reset({
        name: brand.name,
        thumbnail: brand.thumbnail || "",
        isActive: brand.isActive,
      });
    }
    setRemoveThumbnail(false);
  }, [brand, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (loading || !brand) return;
    sonnerToast.dismiss("update-brand-error");
    try {
      const result = await run(
        () =>
          updateMutation.mutateAsync({
            id: brand.id,
            payload: {
              name: values.name,
              thumbnail: values.thumbnail,
              isActive: values.isActive,
            },
          }),
        {
          minDuration: 500,
        },
      );

      handleClose();

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Update brand error:", error);
      sonnerToast.error(
        getErrorMessage(error, "Cập nhật thương hiệu thất bại"),
        {
          id: "update-brand-error",
        },
      );
    }
  });

  if (!open || !brand) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật thương hiệu</h2>

          <Button variant="destructive" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* {Tên thương hiệu} */}
          <div className="space-y-2">
            <Label>Tên thương hiệu</Label>

            <Input
              placeholder="Nhập tên thương hiệu..."
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
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

          {/* {Hoạt động} */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
              className="border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white cursor-pointer"
            />

            <Label>Hiển thị thương hiệu</Label>
          </div>

          <AsyncButton type="submit" loading={loading} disabled={loading}>
            Cập nhật thương hiệu
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateBrand;
