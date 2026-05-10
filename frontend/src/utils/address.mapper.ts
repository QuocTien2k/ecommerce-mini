export function mapOptions(list: any[]) {
  return list.map((item) => ({
    value: item.code,
    label: item.name,
  }));
}

export function buildAddress(params: {
  detail: string;
  wardName?: string;
  provinceName?: string;
}) {
  return [params.detail, params.wardName, params.provinceName]
    .filter(Boolean)
    .join(", ");
}
