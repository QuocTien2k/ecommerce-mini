import { startLoading, stopLoading } from "@/features/loading/loading.slice";
import type { AppDispatch } from "@/app/store";

export const withLoading = async <T>(
  dispatch: AppDispatch,
  fn: () => Promise<T>,
): Promise<T> => {
  dispatch(startLoading());
  try {
    return await fn();
  } finally {
    dispatch(stopLoading());
  }
};
