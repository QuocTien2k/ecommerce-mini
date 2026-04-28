import { withLoading } from "@lib/with-loading";
import { useRef, useState } from "react";

export const useScopedLoading = () => {
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const run = async <T>(
    fn: () => Promise<T>,
    options?: { minDuration?: number; skipDelay?: boolean },
  ): Promise<T> => {
    if (loadingRef.current) {
      return Promise.reject("Already loading");
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      return await withLoading(fn, options);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  return { loading, run };
};
