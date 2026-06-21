import { Card, CardContent } from "@/components/ui/card";

const VoucherEmpty = () => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <p>Bạn không có voucher còn hiệu lực nào.</p>

        <p className="mt-2 text-sm text-muted-foreground">
          Các voucher đã hết hạn hoặc đã sử dụng hết lượt sẽ không hiển thị tại
          đây.
        </p>
      </CardContent>
    </Card>
  );
};

export default VoucherEmpty;
