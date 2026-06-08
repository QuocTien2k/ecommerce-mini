import type { UserVoucher } from "../types/customer.type";
import VoucherCard from "./VoucherCard";

type VoucherListProps = {
  vouchers: UserVoucher[];
};

const VoucherList = ({ vouchers }: VoucherListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {vouchers.map((voucher) => (
        <VoucherCard key={voucher.id} voucher={voucher} />
      ))}
    </div>
  );
};

export default VoucherList;
