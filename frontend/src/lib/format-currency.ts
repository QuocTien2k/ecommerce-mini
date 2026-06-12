export function formatCurrency(value: string | number | null | undefined) {
  if (value == null) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}
