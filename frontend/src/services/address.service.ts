const BASE_URL = "/address-kit/2025-07-01/";

export async function fetchProvinces() {
  const res = await fetch(`${BASE_URL}/provinces`);

  if (!res.ok) throw new Error("Failed to fetch provinces");

  const json = await res.json();
  return json.provinces;
}

export async function fetchCommunes(provinceCode: string) {
  const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/communes`);

  if (!res.ok) throw new Error("Failed to fetch communes");

  const json = await res.json();
  return json.communes;
}
