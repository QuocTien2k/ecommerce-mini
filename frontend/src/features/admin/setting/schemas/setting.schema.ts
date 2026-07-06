import { z } from "zod";

// reusable
export const settingLogoSchema = z.instanceof(File, {
  message: "Logo không hợp lệ",
});

export const settingLogoUrlSchema = z
  .string()
  .url("URL logo không hợp lệ")
  .or(z.literal(""));

// base
const settingBaseSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(1, "Tên website không được để trống")
    .max(100, "Tên website không được vượt quá 100 ký tự"),

  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),

  hotline1: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .optional(),
  hotline2: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .optional(),

  address: z.string().max(255).optional(),

  workingHours: z.string().max(255).optional(),

  facebookUrl: z
    .string()
    .url("URL Facebook không hợp lệ")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("URL Youtube không hợp lệ")
    .optional()
    .or(z.literal("")),
  tiktokUrl: z
    .string()
    .url("URL TikTok không hợp lệ")
    .optional()
    .or(z.literal("")),
  zaloUrl: z.string().url("URL Zalo không hợp lệ").optional().or(z.literal("")),
  googleMapUrl: z
    .string()
    .url("URL Google Map không hợp lệ")
    .optional()
    .or(z.literal("")),
});

// shared
export const settingFormSchema = settingBaseSchema.extend({
  file: settingLogoSchema.optional(),
  logo: settingLogoUrlSchema.optional(),
});

// create
export const createSettingSchema = settingFormSchema.superRefine(
  (data, ctx) => {
    const hasFile = !!data.file;
    const hasLogo = !!data.logo;

    if (hasFile && hasLogo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message:
          "Chỉ được upload logo hoặc cung cấp URL logo, không được dùng đồng thời",
      });
    }
  },
);

export type CreateSettingFormValues = z.input<typeof createSettingSchema>;

export type CreateSettingFormOutput = z.output<typeof createSettingSchema>;
