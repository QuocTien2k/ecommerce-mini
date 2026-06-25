const OrderNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg font-semibold">Không tìm thấy đơn hàng</p>

      <p className="mt-2 text-sm text-muted-foreground">
        Không có đơn hàng nào khớp với bộ lọc hiện tại.
      </p>
    </div>
  );
};

export default OrderNotFound;
