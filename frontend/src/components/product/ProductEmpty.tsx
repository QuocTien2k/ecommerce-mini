import { Package } from "lucide-react";
import { ProductState } from "./ProductState";

type Props = {
  desc?: string;
};

export const ProductEmpty = ({
  desc = "Danh mục này hiện chưa có sản phẩm nào.",
}: Props) => {
  return <ProductState icon={Package} title="Chưa có sản phẩm" desc={desc} />;
};
