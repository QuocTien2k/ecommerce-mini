import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

//chuyển format
export const formatDate = (date: string | Date, pattern = "dd/MM/yyyy") => {
  return format(new Date(date), pattern, {
    locale: vi,
  });
};

//t.gian tương đối
export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
};
