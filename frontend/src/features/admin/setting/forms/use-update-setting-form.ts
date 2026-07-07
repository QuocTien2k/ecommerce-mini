import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateSettingSchema,
  type UpdateSettingFormOutput,
  type UpdateSettingFormValues,
} from "../schemas/setting.schema";
import { settingFormDefaultValues } from "./setting-form-default-values";

export const useAdminUpdateSettingForm = () => {
  return useForm<UpdateSettingFormValues, unknown, UpdateSettingFormOutput>({
    resolver: zodResolver(updateSettingSchema),

    defaultValues: settingFormDefaultValues,

    mode: "onSubmit",
  });
};
