import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const formatDate = (date: string | Date, pattern = "dd/MM/yyyy") => {
  return format(new Date(date), pattern, {
    locale: vi,
  });
};
