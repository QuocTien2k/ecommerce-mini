export function toSlug(input: string): string {
  return input
    .normalize('NFD') // tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '') // remove dấu
    .replace(/đ/g, 'd') // việt hoá
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove ký tự đặc biệt
    .replace(/\s+/g, '-') // space -> dash
    .replace(/-+/g, '-') // collapse dash
    .replace(/^-+|-+$/g, ''); // trim dash
}
