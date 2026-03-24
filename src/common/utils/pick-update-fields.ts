export function pickUpdatedFields<
  TDto extends Partial<TEntity>,
  TEntity extends Record<string, any>,
>(dto: TDto, entity: TEntity): Partial<TEntity> {
  const result: Partial<TEntity> = {};

  for (const key in dto) {
    if (dto[key] !== undefined) {
      result[key as keyof TEntity] = entity[key as keyof TEntity];
    }
  }

  return result;
}
