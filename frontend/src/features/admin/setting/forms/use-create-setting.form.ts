import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createSettingSchema,
  type CreateSettingFormOutput,
  type CreateSettingFormValues,
} from "../schemas/setting.schema";

export const useAdminCreateSettingForm = () => {
  return useForm<CreateSettingFormValues, unknown, CreateSettingFormOutput>({
    resolver: zodResolver(createSettingSchema),

    defaultValues: {
      siteName: "",

      file: undefined,
      logo: "",

      email: "",

      hotline1: "",
      hotline2: "",

      address: "",

      workingHours: "",

      facebookUrl: "",
      youtubeUrl: "",
      tiktokUrl: "",
      zaloUrl: "",

      googleMapUrl: "",
    },

    mode: "onSubmit",
  });
};
