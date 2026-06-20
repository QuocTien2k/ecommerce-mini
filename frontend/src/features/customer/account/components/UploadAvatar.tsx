import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAppSelector } from "@app/hooks";
import { useEffect, useRef, useState } from "react";
import { useUploadAvatarMutation } from "../hooks/useUploadAvatar";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { AsyncButton } from "@components/common/async-button";
import { createPortal } from "react-dom";

type UploadAvatarProps = {
  open: boolean;
  onClose: () => void;
};

export const UploadAvatar = ({ open, onClose }: UploadAvatarProps) => {
  const user = useAppSelector((state) => state.user.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { loading, run } = useScopedLoading();

  const uploadMutation = useUploadAvatarMutation();

  const displayedAvatar = previewUrl || user?.avatar || "";

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      sonnerToast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleClose = () => {
    if (loading) return;

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedFile || loading) return;

    try {
      const result = await run(() => uploadMutation.mutateAsync(selectedFile), {
        minDuration: 500,
      });

      sonnerToast.success(result.message);

      handleClose();
    } catch (error) {
      console.error("Upload avatar error:", error);

      sonnerToast.error(
        getErrorMessage(error, "Cập nhật ảnh đại diện thất bại"),
        {
          id: "upload-avatar-error",
        },
      );
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div className="min-h-full flex items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cập nhật avatar</h2>

            <Button
              variant="destructive"
              size="icon"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <img
                src={displayedAvatar}
                alt="Avatar"
                className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Chọn ảnh mới
              </Button>

              {selectedFile && (
                <p className="max-w-full truncate text-sm text-muted-foreground">
                  {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>

              <AsyncButton
                type="submit"
                loading={loading}
                disabled={!selectedFile}
                className="w-full sm:w-auto"
              >
                Cập nhật avatar
              </AsyncButton>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
};
