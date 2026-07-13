import type { Setting } from "@/domains/setting/types/setting.type";
import { useAdminCreateSettingForm } from "../forms/use-create-setting.form";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAdminCreateSetting } from "../hooks/useCreateSetting";
import { useEffect, useRef, useState } from "react";
import type { CreateSettingFormOutput } from "../schemas/setting.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error-message";
import { Button } from "@components/ui/button";
import { AsyncButton } from "@components/common/async-button";
import { FieldError } from "@components/ui/field-error";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { ImagePlus } from "lucide-react";
import { Textarea } from "@components/ui/textarea";
import { Controller } from "react-hook-form";
import { useAdminUpdateSettingForm } from "../forms/use-update-setting-form";
import { useAdminUpdateSetting } from "../hooks/useUpdateSetting";

type AdminSettingFormProps = {
  mode: "create" | "update";
  onSuccess: () => void;
  setting?: Setting;
};

const AdminSettingForm = ({
  mode,
  onSuccess,
  setting,
}: AdminSettingFormProps) => {
  //form
  const createForm = useAdminCreateSettingForm();
  const updateForm = useAdminUpdateSettingForm();

  const form = mode === "create" ? createForm : updateForm;

  const { loading, run } = useScopedLoading();

  //hook
  const createSettingMutation = useAdminCreateSetting();
  const updateSettingMutation = useAdminUpdateSetting();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"upload" | "url">("upload");

  // watch
  const selectedFile = form.watch("file");
  const logo = form.watch("logo");

  // preview
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    if (logo) {
      setPreviewUrl(logo);
      return;
    }

    setPreviewUrl(null);
  }, [selectedFile, logo]);

  // upload <-> url
  useEffect(() => {
    if (imageSource === "upload") {
      form.setValue("logo", "");
      return;
    }

    form.setValue("file", undefined);
  }, [imageSource, form]);

  //render data when open form
  useEffect(() => {
    if (mode !== "update" || !setting) return;

    form.reset({
      siteName: setting.siteName,

      file: undefined,
      logo: setting.logo ?? "",

      email: setting.email ?? "",

      hotline1: setting.hotline1 ?? "",
      hotline2: setting.hotline2 ?? "",

      address: setting.address ?? "",

      workingHours: setting.workingHours ?? "",

      facebookUrl: setting.facebookUrl ?? "",
      youtubeUrl: setting.youtubeUrl ?? "",
      tiktokUrl: setting.tiktokUrl ?? "",
      zaloUrl: setting.zaloUrl ?? "",

      googleMapUrl: setting.googleMapUrl ?? "",
    });

    setImageSource(setting.logo ? "url" : "upload");
  }, [mode, setting, form]);

  const handleClose = () => {
    form.reset();
    form.clearErrors();

    setPreviewUrl(null);
    setImageSource("upload");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onSuccess();
  };

  const onSubmit = form.handleSubmit(
    async (values: CreateSettingFormOutput) => {
      if (loading) return;

      sonnerToast.dismiss("create-setting-error");

      try {
        const payload = {
          data: {
            siteName: values.siteName,

            logo: values.logo || undefined,

            email: values.email || undefined,

            hotline1: values.hotline1 || undefined,
            hotline2: values.hotline2 || undefined,

            address: values.address || undefined,

            workingHours: values.workingHours || undefined,

            facebookUrl: values.facebookUrl || undefined,
            youtubeUrl: values.youtubeUrl || undefined,
            tiktokUrl: values.tiktokUrl || undefined,
            zaloUrl: values.zaloUrl || undefined,

            googleMapUrl: values.googleMapUrl || undefined,
          },

          file: values.file,
        };

        const result = await run(() =>
          mode === "create"
            ? createSettingMutation.mutateAsync(payload)
            : updateSettingMutation.mutateAsync(payload),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Create setting error:", error);

        sonnerToast.error(getErrorMessage(error, "Tạo cài đặt thất bại"), {
          id: "create-setting-error",
        });
      }
    },
  );

  // sync logo url
  const syncLogoUrl = (url: string) => {
    form.setValue("logo", url.trim(), {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Site information */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold">Thông tin website</h3>

        <div className="space-y-2">
          <Label>Tên website</Label>

          <Input
            placeholder="Ví dụ: Tech Shop"
            {...form.register("siteName")}
          />

          <FieldError error={form.formState.errors.siteName} />
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold">Thông tin liên hệ</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              placeholder="example@gmail.com"
              {...form.register("email")}
            />

            <FieldError error={form.formState.errors.email} />
          </div>

          <div className="space-y-2">
            <Label>Giờ làm việc</Label>

            <Input
              placeholder="08:00 - 17:00"
              {...form.register("workingHours")}
            />
            <FieldError error={form.formState.errors.workingHours} />
          </div>

          <div className="space-y-2">
            <Label>Hotline 1</Label>

            <Input placeholder="0901234567" {...form.register("hotline1")} />

            <FieldError error={form.formState.errors.hotline1} />
          </div>

          <div className="space-y-2">
            <Label>Hotline 2</Label>

            <Input placeholder="0901234567" {...form.register("hotline2")} />

            <FieldError error={form.formState.errors.hotline2} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Địa chỉ</Label>

          <Textarea
            rows={3}
            placeholder="Nhập địa chỉ..."
            {...form.register("address")}
          />
          <FieldError error={form.formState.errors.address} />
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold">Logo website</h3>

        <div className="space-y-2">
          <Label>Nguồn logo</Label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={imageSource === "upload"}
                onChange={() => setImageSource("upload")}
              />

              <span>Upload logo</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={imageSource === "url"}
                onChange={() => setImageSource("url")}
              />

              <span>Dán URL logo</span>
            </label>
          </div>
        </div>

        {imageSource === "upload" && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              id="setting-logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                form.setValue("file", file, {
                  shouldValidate: true,
                });
              }}
            />

            <div className="flex items-center gap-4">
              <Label
                htmlFor="setting-logo"
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
                  htmlFor="setting-logo"
                  className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                >
                  Chọn logo
                </Label>

                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>

                {selectedFile && (
                  <p className="max-w-60 truncate text-xs text-muted-foreground">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <FieldError error={form.formState.errors.logo} />
          </div>
        )}

        {imageSource === "url" && (
          <div className="space-y-3">
            <Controller
              control={form.control}
              name="logo"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="https://example.com/logo.png"
                />
              )}
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

            <FieldError error={form.formState.errors.logo} />

            <FieldError error={form.formState.errors.file} />
          </div>
        )}
      </div>

      {/* Social */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold">Mạng xã hội</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Facebook</Label>

            <Input
              placeholder="https://facebook.com/..."
              {...form.register("facebookUrl")}
            />
            <FieldError error={form.formState.errors.facebookUrl} />
          </div>

          <div className="space-y-2">
            <Label>Youtube</Label>

            <Input
              placeholder="https://youtube.com/..."
              {...form.register("youtubeUrl")}
            />
            <FieldError error={form.formState.errors.youtubeUrl} />
          </div>

          <div className="space-y-2">
            <Label>TikTok</Label>

            <Input
              placeholder="https://tiktok.com/..."
              {...form.register("tiktokUrl")}
            />
            <FieldError error={form.formState.errors.tiktokUrl} />
          </div>

          <div className="space-y-2">
            <Label>Zalo</Label>

            <Input
              placeholder="https://zalo.me/..."
              {...form.register("zaloUrl")}
            />
            <FieldError error={form.formState.errors.zaloUrl} />
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold">Google Map</h3>

        <div className="space-y-2">
          <Label>Google Map URL</Label>

          <Input
            placeholder="https://maps.google.com/..."
            {...form.register("googleMapUrl")}
          />

          <FieldError error={form.formState.errors.googleMapUrl} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <Button type="button" variant="destructive" onClick={handleClose}>
          Hủy
        </Button>

        <AsyncButton type="submit" loading={loading} disabled={loading}>
          {mode === "create" ? "Tạo cài đặt" : "Cập nhật cài đặt"}
        </AsyncButton>
      </div>
    </form>
  );
};

export default AdminSettingForm;
