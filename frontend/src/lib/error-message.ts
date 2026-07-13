import type { ApiError } from "@/types/api-error";

const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "response" in error;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Có lỗi xảy ra",
): string => {
  if (isApiError(error)) {
    const status = error.response?.status;

    switch (status) {
      case 401:
        return "Vui lòng đăng nhập để sử dụng tính năng này.";

      case 403:
        return "Bạn không có quyền thực hiện thao tác này.";

      case 404:
        return error.response?.data?.message ?? "Không tìm thấy dữ liệu.";

      default:
        return error.response?.data?.message ?? fallback;
    }
  }

  return fallback;
};

export const isNotFoundError = (error: unknown): boolean => {
  return isApiError(error) && error.response?.status === 404;
};
