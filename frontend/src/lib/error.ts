import type { ApiError } from "@/types/api-error";

const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "response" in error;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Có lỗi xảy ra",
): string => {
  if (isApiError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};
