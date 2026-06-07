import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useAppSelector } from "@app/hooks";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfile";
import { useUpdateProfileForm } from "../form/use-update-profile";
import { useAddressResolver } from "@/hooks/address/useAddressResolver";
import { useEffect } from "react";
import { buildAddress, parseAddress } from "@/utils/address.mapper";
import type { UpdateProfileSchema } from "../schema/account.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { AsyncButton } from "@components/common/async-button";
import { Input } from "@components/ui/input";
import { Controller } from "react-hook-form";
import { ProvinceSelect } from "@components/address/ProvinceSelect";
import { CommuneSelect } from "@components/address/CommuneSelect";

type UpdateProfileProps = {
  open: boolean;
  onClose: () => void;
};

export const UpdateProfile = ({ open, onClose }: UpdateProfileProps) => {
  const user = useAppSelector((state) => state.user.user);
  const { loading, run } = useScopedLoading();
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, dirtyFields, isSubmitted },
  } = useUpdateProfileForm();

  const address = watch("address");

  const { provinceName, wardName } = useAddressResolver({
    provinceCode: address.provinceCode,
    wardCode: address.wardCode,
  });

  useEffect(() => {
    if (!open || !user) return;

    const parsed = parseAddress(user.address);

    reset({
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,

      address: {
        provinceCode: "",
        wardCode: "",
        detail: parsed.detail,
      },
    });
  }, [open, user, reset]);

  const getErrorVisibility = (field: keyof UpdateProfileSchema) =>
    errors[field] && (dirtyFields[field] || isSubmitted);

  const showDetailError =
    errors.address?.detail && (dirtyFields.address?.detail || isSubmitted);

  const showProvinceError =
    errors.address?.provinceCode &&
    (dirtyFields.address?.provinceCode || isSubmitted);

  const showWardError =
    errors.address?.wardCode && (dirtyFields.address?.wardCode || isSubmitted);

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const onSubmit = async (values: UpdateProfileSchema) => {
    sonnerToast.dismiss("update-profile-error");

    try {
      await run(
        async () => {
          const payload = {
            fullname: values.fullname,
            phone: values.phone,
            email: values.email,

            address: buildAddress({
              detail: values.address.detail,
              provinceName,
              wardName,
            }),
          };

          await updateProfileMutation.mutateAsync(payload);

          return true;
        },
        {
          minDuration: 600,
        },
      );

      sonnerToast.success("Cập nhật thành công");

      onClose();
    } catch (error) {
      const apiError = error as {
        errors?: {
          phone?: string;
          email?: string;
        };
      };

      if (apiError?.errors?.phone === "duplicated") {
        setError("phone", {
          type: "server",
          message: "Số điện thoại đã được sử dụng",
        });

        return;
      }

      if (apiError?.errors?.email === "duplicated") {
        setError("email", {
          type: "server",
          message: "Email đã được sử dụng",
        });

        return;
      }

      sonnerToast.error(getErrorMessage(error, "Cập nhật thất bại"), {
        id: "update-profile-error",
      });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật thông tin</h2>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Fullname */}
          <div className="space-y-2">
            <Input
              placeholder="Họ và tên"
              {...register("fullname")}
              className="h-11"
            />

            <p
              className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                getErrorVisibility("fullname")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.fullname?.message}
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Input
              placeholder="Số điện thoại"
              {...register("phone")}
              className="h-11"
            />

            <p
              className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                getErrorVisibility("phone")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.phone?.message}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Input
              placeholder="Email"
              {...register("email")}
              className="h-11"
            />

            <p
              className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                getErrorVisibility("email")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.email?.message}
            </p>
          </div>

          {/* Address */}
          <div className="space-y-4">
            {/* Province */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="address.provinceCode"
                render={({ field }) => (
                  <ProvinceSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);

                      setValue("address.wardCode", "");
                    }}
                  />
                )}
              />

              <p
                className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                  showProvinceError
                    ? "max-h-10 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {errors.address?.provinceCode?.message}
              </p>
            </div>

            {/* Ward */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="address.wardCode"
                render={({ field }) => (
                  <CommuneSelect
                    provinceCode={watch("address.provinceCode")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <p
                className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                  showWardError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {errors.address?.wardCode?.message}
              </p>
            </div>

            {/* Detail address */}
            <div className="space-y-2">
              <Input
                placeholder="Địa chỉ chi tiết"
                {...register("address.detail")}
                className="h-11"
              />

              <p
                className={`overflow-hidden text-sm text-red-500 transition-all duration-200 ${
                  showDetailError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {errors.address?.detail?.message}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>

            <AsyncButton type="submit" loading={loading} disabled={loading}>
              Cập nhật thông tin
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};
