import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useUpdateCategoryForm } from "../forms/use-update-category-form";
import type {
  AdminCategoryItem,
  VariantType,
} from "../types/admin-category.type";
import { useEffect, useRef, useState } from "react";
import { useUpdateCategoryMutation } from "../hooks/useAdminUpdateCategory";
import { useAdminFlatCategoriesQuery } from "../hooks/useAdminCategoryFlatQuery";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
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
import { variantTypeOptions } from "@shared/types/variant-type";

type UpdateCategoryFormProps = {
  open: boolean;
  onClose: () => void;
  category: AdminCategoryItem | null;
};

export const UpdateCategoryForm = ({
  open,
  onClose,
  category,
}: UpdateCategoryFormProps) => {
  const form = useUpdateCategoryForm();

  const { loading, run } = useScopedLoading();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useUpdateCategoryMutation();
  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  const selectedFile = form.watch("file");
  const parentId = form.watch("parentId");
  const isActive = form.watch("isActive");

  //  init form change or open
  useEffect(() => {
    if (!category) return;

    form.reset({
      name: category.name,
      description: category.description ?? "",
      parentId: category.parentId ?? undefined,
      isActive: category.isActive,
      variantType: category.variantType,
      file: undefined,
    });

    setPreviewUrl(category.image);
  }, [category, form]);

  // file preview
  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClose = () => {
    form.reset();
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!category || loading) return;

    try {
      const result = await run(
        () =>
          updateMutation.mutateAsync({
            id: category.id,
            data: {
              name: values.name,
              description: values.description,
              parentId: values.parentId || undefined,
              isActive: values.isActive,
              variantType: values.variantType,
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
      console.error("Update category error:", error);
      sonnerToast.error(getErrorMessage(error, "Cập nhật danh mục thất bại"), {
        id: "category-update-error",
      });
    }
  });

  if (!open || !category) return null;

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
          <h2 className="text-lg font-semibold">Cập nhật danh mục</h2>

          <Button variant="destructive" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* NAME */}
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
          </div>

          {/* DESCRIPTION */}
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

          {/* PARENT */}
          <div className="space-y-2">
            <Label>Danh mục cha</Label>

            <Select
              value={parentId || "none"}
              onValueChange={(value) =>
                form.setValue("parentId", value === "none" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>

              <SelectContent className="max-h-72 p-2 text-black/50">
                <SelectItem value="none">Không có danh mục cha</SelectItem>
                {flatCategoriesQuery.data?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {"ㅤ".repeat((category.level - 1) * 2)}
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* {Loại variant} */}
          <div className="space-y-2">
            <Label>Loại variant</Label>

            <Select
              value={form.watch("variantType")}
              onValueChange={(value) =>
                form.setValue("variantType", value as VariantType, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại variant" />
              </SelectTrigger>

              <SelectContent className="text-black/50" position="popper">
                {variantTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.variantType && (
              <p className="text-sm text-red-500">
                {form.formState.errors.variantType.message}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div className="space-y-3">
            <Label>Ảnh danh mục</Label>

            <input
              id="category-image-update"
              type="file"
              ref={fileInputRef}
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
                htmlFor="category-image-update"
                className="flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted transition hover:bg-muted/80"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <ImagePlus className="size-5" />
                  </div>
                )}
              </Label>

              <div className="space-y-1">
                <Label
                  htmlFor="category-image-update"
                  className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                >
                  Thay đổi ảnh
                </Label>

                {selectedFile && (
                  <p className="text-xs text-muted-foreground truncate max-w-56">
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

          {/* ACTIVE */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
              className="cursor-pointer"
            />

            <Label>Hiển thị danh mục</Label>
          </div>

          <AsyncButton type="submit" loading={loading}>
            Cập nhật danh mục
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};
