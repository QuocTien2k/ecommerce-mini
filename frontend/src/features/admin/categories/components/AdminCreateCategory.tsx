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
import { ImagePlus, Info, X } from "lucide-react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error-message";
import { AsyncButton } from "@components/common/async-button";
import { toSlug } from "@/utils/toSlug";
import { VARIANT_TYPES, type VariantType } from "../types/admin-category.type";
import { variantTypeOptions } from "@shared/types/variant-type";
import { FieldError } from "@components/ui/field-error";
import { CategoryCombobox } from "./CategoryCombobox";

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

  //parentId
  const parentId = form.watch("parentId");

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

    const input = document.getElementById("category-image") as HTMLInputElement;

    if (input) input.value = "";

    onClose();
  };

  const createCategoryMutation = useCreateCategoryMutation();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const flatCategories = flatCategoriesQuery.data?.data ?? [];

  const selectedParent = flatCategories.find((item) => item.id === parentId);

  useEffect(() => {
    if (selectedParent) {
      form.setValue("variantType", selectedParent.variantType, {
        shouldValidate: true,
      });

      return;
    }

    form.setValue("variantType", VARIANT_TYPES.NONE, {
      shouldValidate: true,
    });
  }, [selectedParent, form]);

  const isVariantInherited = !!selectedParent;

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
          {/* {Tên danh mục} */}
          <div className="space-y-2">
            <Label>Tên danh mục</Label>

            <Input
              placeholder="Nhập tên danh mục..."
              {...form.register("name")}
            />

            <FieldError error={form.formState.errors.name} />
            {categoryName && (
              <p className="text-[14px] text-blue-500 text-shadow-blue-800">
                Slug preview: {toSlug(categoryName)}
              </p>
            )}
          </div>

          {/* {Mô tả} */}
          <div className="space-y-2">
            <Label>Mô tả</Label>

            <Textarea
              placeholder="Mô tả danh mục..."
              {...form.register("description")}
            />

            <FieldError error={form.formState.errors.description} />
          </div>

          {/* {Chọn danh mục cha} */}
          <div className="space-y-2">
            <Label>Danh mục cha</Label>

            <CategoryCombobox
              categories={flatCategories}
              value={form.watch("parentId")}
              allowNone
              onChange={(value) =>
                form.setValue("parentId", value, {
                  shouldValidate: true,
                })
              }
            />
          </div>

          {/* {Loại variant} */}
          <div className="space-y-2">
            <Label>Loại variant</Label>

            <Select
              disabled={isVariantInherited}
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
            {isVariantInherited && (
              <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                <Info className="h-3.5 w-3.5" />
                <span>Loại variant được kế thừa từ danh mục cha</span>
              </div>
            )}

            <FieldError error={form.formState.errors.variantType} />
          </div>

          {/* {Ảnh danh mục} */}
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

            <FieldError error={form.formState.errors.file} />
          </div>

          {/* {Hoạt động} */}
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
