import { SearchX } from "lucide-react";
import { ProductState } from "./ProductState";

type Props = {
  desc?: string;
};

export const ProductNotFound = ({
  desc = "Không có sản phẩm phù hợp với điều kiện tìm kiếm.",
}: Props) => {
  return (
    <ProductState icon={SearchX} title="Không tìm thấy sản phẩm" desc={desc} />
  );
};
