import { toast } from "sonner";

export type SonnerToastOptions = {
  id?: string;
  duration?: number;
};

const DEFAULT_DURATION = 900;

export const sonnerToast = {
  error: (message: string, options?: SonnerToastOptions) => {
    toast.error(message, {
      id: options?.id,
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  success: (message: string, options?: SonnerToastOptions) => {
    toast.success(message, {
      id: options?.id,
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  dismiss: (id?: string) => {
    toast.dismiss(id);
  },
};
