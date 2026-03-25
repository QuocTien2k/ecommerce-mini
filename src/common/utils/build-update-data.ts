export function buildUpdateData<T extends object>(dto: T): Partial<T> {
  const data: Partial<T> = {};

  for (const key in dto) {
    if (dto[key] !== undefined) {
      data[key] = dto[key];
    }
  }

  return data;
}
