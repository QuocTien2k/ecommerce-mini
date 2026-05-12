import { useEffect, useState } from "react";
import { useCreateCategoryMutation } from "../hooks/useAdminCreateCategory";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { useCreateCategoryForm } from "../forms/use-create-category-form";
import { useAdminFlatCategoriesQuery } from "../hooks/useAdminCategoryFlatQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { ImagePlus, X } from "lucide-react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { AsyncButton } from "@components/common/async-button";
import { toSlug } from "@/utils/toSlug";

type CreateCategoryFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateCategoryForm = ({
  open,
  onClose,
}: CreateCategoryFormProps) => {
  const form = useCreateCategoryForm();
  const { loading, run } = useScopedLoading();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  //preview slug
  const categoryName = form.watch("name");

  // watch file
  const selectedFile = form.watch("file");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClose = () => {
    form.reset();

    setPreviewUrl(null);

    onClose();
  };

  const createCategoryMutation = useCreateCategoryMutation();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  const onSubmit = form.handleSubmit(async (values) => {
    if (loading) return;

    sonnerToast.dismiss("category-create-error");

    try {
      const result = await run(
        () =>
          createCategoryMutation.mutateAsync({
            data: {
              name: values.name,

              description: values.description,

              parentId: values.parentId || undefined,

              isActive: values.isActive,
            },

            file: values.file,
          }),
        {
          minDuration: 500,
        },
      );

      handleClose();

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Create category error:", error);
      sonnerToast.error(getErrorMessage(error, "Tạo danh mục thất bại"), {
        id: "category-create-error",
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
          w-full max-w-2xl
          rounded-2xl
          border border-white/10
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tạo danh mục</h2>

          <Button variant="destructive" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Tên danh mục</Label>

            <Input
              placeholder="Nhập tên danh mục..."
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}

            {categoryName && (
              <p className="text-[14px] text-blue-500 text-shadow-blue-800">
                Slug preview: {toSlug(categoryName)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>

            <Textarea
              placeholder="Mô tả danh mục..."
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Danh mục cha</Label>

            <Select onValueChange={(value) => form.setValue("parentId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>

              <SelectContent>
                {flatCategoriesQuery.data?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.parentId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.parentId.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Ảnh danh mục</Label>

            <input
              id="category-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                form.setValue("file", file, {
                  shouldValidate: true,
                });
              }}
            />

            <div className="flex items-center gap-4">
              <Label
                htmlFor="category-image"
                className="
        flex size-24 cursor-pointer items-center justify-center
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
                    <ImagePlus className="size-5" />
                  </div>
                )}
              </Label>

              <div className="space-y-1">
                <Label
                  htmlFor="category-image"
                  className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                >
                  Chọn ảnh
                </Label>

                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>

                {selectedFile && (
                  <p className="max-w-55 truncate text-xs text-muted-foreground">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {form.formState.errors.file && (
              <p className="text-sm text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={form.watch("isActive")}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
              className="
    border-emerald-500
    data-[state=checked]:bg-emerald-500
    data-[state=checked]:border-emerald-500
    data-[state=checked]:text-white
    cursor-pointer
  "
            />

            <Label>Hiển thị danh mục</Label>
          </div>

          <AsyncButton type="submit" loading={loading} disabled={loading}>
            Tạo danh mục
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};
