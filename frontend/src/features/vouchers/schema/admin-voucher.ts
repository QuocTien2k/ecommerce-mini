import { z } from "zod";
import { VOUCHER_SCOPES, VOUCHER_TYPES } from "../types/admin-voucher.type";

const optionalPositiveNumber = (
  invalidMessage: string,
  minValue: number,
  minMessage: string,
) =>
  z.preprocess(
    (value) => {
      if (value === "" || Number.isNaN(value)) {
        return undefined;
      }

      return value;
    },
    z
      .number({
        error: invalidMessage,
      })
      .min(minValue, minMessage)
      .optional(),
  );

export const createVoucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Mã voucher là bắt buộc")
      .transform((val) => val.toUpperCase()),

    type: z.enum([VOUCHER_TYPES.PERCENT, VOUCHER_TYPES.FIXED]),

    value: z.number().min(1, "Giá trị phải >= 1"),

    maxDiscount: optionalPositiveNumber(
      "Giảm tối đa không hợp lệ",
      1,
      "Giảm tối đa phải >= 1",
    ),

    minOrderValue: optionalPositiveNumber(
      "Đơn tối thiểu không hợp lệ",
      0,
      "Đơn tối thiểu không được nhỏ hơn 0",
    ),

    usageLimit: z
      .number({
        error: "Giới hạn sử dụng không hợp lệ",
      })
      .min(1, "Giới hạn sử dụng phải >= 1"),

    scope: z.enum([
      VOUCHER_SCOPES.ORDER,
      VOUCHER_SCOPES.PRODUCT,
      VOUCHER_SCOPES.CATEGORY,
    ]),

    isActive: z.boolean().default(true),

    startAt: z.string().min(1, "Thời gian bắt đầu là bắt buộc"),

    endAt: z.string().min(1, "Thời gian kết thúc là bắt buộc"),

    productIds: z.array(z.string()).optional(),

    categoryIds: z.array(z.string()).optional(),
  })

  // percent <= 100
  .refine(
    (data) => !(data.type === VOUCHER_TYPES.PERCENT && data.value > 100),
    {
      path: ["value"],
      message: "Giá trị phần trăm không được vượt quá 100",
    },
  )

  // percent cần maxDiscount
  .refine(
    (data) =>
      !(data.type === VOUCHER_TYPES.PERCENT && data.maxDiscount == null),
    {
      path: ["maxDiscount"],
      message: "Voucher % cần maxDiscount",
    },
  )

  // fixed không dùng maxDiscount
  .refine(
    (data) => !(data.type === VOUCHER_TYPES.FIXED && data.maxDiscount != null),
    {
      path: ["maxDiscount"],
      message: "Voucher FIXED không dùng maxDiscount",
    },
  )

  // startAt < endAt
  .refine(
    (data) => {
      return new Date(data.startAt).getTime() <= new Date(data.endAt).getTime();
    },
    {
      path: ["endAt"],
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    },
  )

  // PRODUCT cần productIds
  .refine(
    (data) => {
      if (data.scope !== VOUCHER_SCOPES.PRODUCT) {
        return true;
      }

      return !!data.productIds?.length;
    },
    {
      path: ["productIds"],
      message: "Voucher PRODUCT cần có sản phẩm",
    },
  )

  // CATEGORY cần categoryIds
  .refine(
    (data) => {
      if (data.scope !== VOUCHER_SCOPES.CATEGORY) {
        return true;
      }

      return !!data.categoryIds?.length;
    },
    {
      path: ["categoryIds"],
      message: "Voucher CATEGORY cần có danh mục",
    },
  )

  // ORDER không được có ids
  .refine(
    (data) => {
      if (data.scope !== VOUCHER_SCOPES.ORDER) {
        return true;
      }

      return !data.productIds?.length && !data.categoryIds?.length;
    },
    {
      path: ["scope"],
      message: "Voucher ORDER không được có productIds hoặc categoryIds",
    },
  );

export type CreateVoucherFormValues = z.input<typeof createVoucherSchema>;

export type CreateVoucherFormOutput = z.output<typeof createVoucherSchema>;

//update
export const updateVoucherSchema = z
  .object({
    isActive: z.boolean().optional(),

    startAt: z.string().min(1, "Thời gian bắt đầu không hợp lệ").optional(),
    endAt: z.string().min(1, "Thời gian kết thúc không hợp lệ").optional(),

    usageLimit: z
      .number({
        error: "Giới hạn sử dụng không hợp lệ",
      })
      .min(1, "Giới hạn sử dụng phải >= 1")
      .optional(),

    minOrderValue: optionalPositiveNumber(
      "Đơn tối thiểu không hợp lệ",
      0,
      "Đơn tối thiểu không được nhỏ hơn 0",
    ),
  })

  .refine(
    (data) => {
      if (!data.startAt || !data.endAt) return true;

      return new Date(data.startAt).getTime() <= new Date(data.endAt).getTime();
    },
    {
      path: ["endAt"],
      message: "Thời gian kết thúc phải sau hoặc bằng thời gian bắt đầu",
    },
  );
export type UpdateVoucherFormValues = z.input<typeof updateVoucherSchema>;

export type UpdateVoucherFormOutput = z.output<typeof updateVoucherSchema>;
