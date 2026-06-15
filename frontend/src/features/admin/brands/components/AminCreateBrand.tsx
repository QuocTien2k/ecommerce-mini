import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useCreateBrandForm } from "../forms/use-create-brand-form";
import { useAdminCreateBrand } from "../hooks/useAdminCreateBrand";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { toSlug } from "@/utils/toSlug";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

type CreateBrandFormProps = {
  open: boolean;
  onClose: () => void;
};

const AminCreateBrand = ({ open, onClose }: CreateBrandFormProps) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  const form = useCreateBrandForm();
  const { loading, run } = useScopedLoading();

  //preview slug
  const brandName = form.watch("name");

  const isActive = form.watch("isActive");

  const thumbnailPreview = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  useEffect(() => {
    setThumbnailError(false);
  }, [thumbnailPreview]);

  const handleClose = () => {
    form.reset();

    onClose();
  };

  const createBrand = useAdminCreateBrand();

  const onSubmit = form.handleSubmit(async (values) => {
    if (loading) return;

    sonnerToast.dismiss("brand-create-error");

    try {
      const result = await run(
        () =>
          createBrand.mutateAsync({
            name: values.name,
            thumbnail: values.thumbnail,
            isActive: values.isActive,
          }),
        {
          minDuration: 500,
        },
      );

      handleClose();

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Create brand error:", error);
      sonnerToast.error(getErrorMessage(error, "Tạo thương hiệu thất bại"), {
        id: "brand-create-error",
      });
    }
  });

  if (!open) return null;

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
          <h2 className="text-lg font-semibold">Tạo thương hiệu</h2>

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

            {brandName && (
              <p className="text-[14px] text-blue-500 text-shadow-blue-800">
                Slug preview: {toSlug(brandName)}
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
            Tạo thương hiệu
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};

export default AminCreateBrand;
