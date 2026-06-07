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

export function parseAddress(address: string) {
  const parts = address.split(",").map((item) => item.trim());

  if (parts.length < 3) {
    return {
      detail: address,
      wardName: "",
      provinceName: "",
    };
  }

  return {
    detail: parts.slice(0, -2).join(", "),
    wardName: parts.at(-2) ?? "",
    provinceName: parts.at(-1) ?? "",
  };
}
