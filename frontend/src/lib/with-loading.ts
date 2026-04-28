import { startLoading, stopLoading } from "@/features/loading/loading.slice";
import type { AppDispatch } from "@/app/store";
import { ensureMinDelay } from "./sleep";

type WithLoadingOptions = {
  minDuration?: number;
  skipDelay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
};

export const withLoading = async <T>(
  fn: () => Promise<T>,
  options: WithLoadingOptions = {},
): Promise<T> => {
  const { minDuration = 800, skipDelay = false, onStart, onEnd } = options;

  const start = Date.now();
  onStart?.();

  try {
    return await fn();
  } finally {
    if (!skipDelay) {
      await ensureMinDelay(start, minDuration);
    }
    onEnd?.();
  }
};
