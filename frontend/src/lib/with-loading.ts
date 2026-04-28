import { startLoading, stopLoading } from "@/features/loading/loading.slice";
import type { AppDispatch } from "@/app/store";
import { ensureMinDelay } from "./sleep";

export const withLoading = async <T>(
  dispatch: AppDispatch,
  fn: () => Promise<T>,
  minDuration = 800,
): Promise<T> => {
  const start = Date.now();
  dispatch(startLoading());
  try {
    return await fn();
  } finally {
    await ensureMinDelay(start, minDuration);
    dispatch(stopLoading());
  }
};
