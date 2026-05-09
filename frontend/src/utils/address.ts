interface BuildAddressParams {
  detail?: string;
  ward?: string;
  province?: string;
}

export const buildAddress = ({
  detail,
  ward,
  province,
}: BuildAddressParams) => {
  return [detail, ward, province]
    .filter(Boolean)
    .map((item) => item?.trim())
    .join(", ");
};
