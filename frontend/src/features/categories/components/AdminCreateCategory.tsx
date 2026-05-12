import { useState } from "react";
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

type CreateCategoryFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateCategoryForm = ({
  open,
  onClose,
}: CreateCategoryFormProps) => {
  if (!open) return null;

  const form = useCreateCategoryForm();

  const createCategoryMutation = useCreateCategoryMutation();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  const [file, setFile] = useState<File>();

  const onSubmit = form.handleSubmit(async (values) => {
    await createCategoryMutation.mutateAsync({
      data: {
        ...values,

        parentId: values.parentId || undefined,
      },

      file,
    });

    form.reset();

    setFile(undefined);
    onClose();
  });

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/10
        backdrop-blur-xl
        p-6
        shadow-xl
      "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tạo danh mục</h2>

        <Button type="button" variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Tên danh mục</Label>

          <Input
            placeholder="Nhập tên danh mục..."
            {...form.register("name")}
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>

          <Input
            placeholder="slug-tu-dong-hoac-tu-nhap"
            {...form.register("slug")}
          />
        </div>

        <div className="space-y-2">
          <Label>Mô tả</Label>

          <Textarea
            placeholder="Mô tả danh mục..."
            {...form.register("description")}
          />
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
        </div>

        <div className="space-y-2">
          <Label>Ảnh</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            checked={form.watch("isActive")}
            onCheckedChange={(checked) =>
              form.setValue("isActive", Boolean(checked))
            }
          />

          <Label>Hiển thị danh mục</Label>
        </div>

        <Button type="submit" disabled={createCategoryMutation.isPending}>
          {createCategoryMutation.isPending ? "Đang tạo..." : "Tạo danh mục"}
        </Button>
      </form>
    </div>
  );
};
