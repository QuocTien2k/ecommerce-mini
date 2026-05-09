export function mapOptions(list: any[]) {
  return list.map((item) => ({
    value: item.code,
    label: item.name,
  }));
}

export function buildAddress(address: {
  detail: string;
  wardName?: string;
  provinceName?: string;
}) {
  return [address.detail, address.wardName, address.provinceName]
    .filter(Boolean)
    .join(", ");
}
