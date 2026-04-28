import { withLoading } from "@lib/with-loading";
import { useState } from "react";

export const useScopedLoading = () => {
  const [loading, setLoading] = useState(false);

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (loading) return Promise.reject("Already loading");

    return withLoading(fn, {
      onStart: () => setLoading(true),
      onEnd: () => setLoading(false),
      skipDelay: true,
    });
  };

  return { loading, run };
};
