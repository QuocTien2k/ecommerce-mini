import { Card, CardContent } from "@/components/ui/card";

const VoucherEmpty = () => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        Bạn chưa có voucher nào.
      </CardContent>
    </Card>
  );
};

export default VoucherEmpty;
