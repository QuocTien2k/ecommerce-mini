import { Link, useParams } from "react-router-dom";
import { useAdminProductDetail } from "./hooks/useAdminProductDetail";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { AdminProductVariant } from "./types/admin-variant.type";

const AdminProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useAdminProductDetail(id!);

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      {!data ? (
        <div>Không tìm thấy sản phẩm</div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <Title title="Chi tiết sản phẩm" />

            <Button asChild>
              <Link to="/admin/products">
                <ArrowLeft size={16} /> Quay lại sản phẩm
              </Link>
            </Button>
          </div>

          <div>
            <h1>{data.name}</h1>

            <p>{data.description}</p>

            <div>
              <strong>Category:</strong> {data.category.name}
            </div>

            <div>
              <strong>Price:</strong> {data.price}
            </div>

            <div>
              <strong>Discount:</strong> {data.discountPct ?? 0}%
            </div>

            <div>
              <strong>Creator:</strong> {data.creator.fullname}
            </div>

            <div>
              <strong>Status:</strong>
              {data.isActive ? "Active" : "Inactive"}
            </div>

            <hr />

            <h2>Variants</h2>

            {data.variants.map((variant: AdminProductVariant) => (
              <div
                key={variant.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <strong>Color:</strong> {variant.color}
                </div>

                <div>
                  <strong>Size:</strong> {variant.attributes?.size}
                </div>

                <div>
                  <strong>Stock:</strong> {variant.stock}
                </div>

                <div>
                  <strong>Images:</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {variant.images.map((img: string) => (
                    <img
                      key={img}
                      src={img}
                      alt=""
                      width={100}
                      height={120}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </QueryStateWrapper>
  );
};

export default AdminProductDetail;
