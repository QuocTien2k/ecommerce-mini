import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  VOUCHER_SCOPES,
  VOUCHER_STATUSES,
  VOUCHER_TYPES,
  type VoucherScope,
  type VoucherStatus,
  type VoucherType,
} from "@features/admin/vouchers/types/admin-voucher.type";

type Props = {
  filters: {
    search: string;

    type: "" | VoucherType;

    scope: "" | VoucherScope;

    status: "" | VoucherStatus;

    isActive: "" | "true" | "false";
  };

  actions: {
    setSearch: (value: string) => void;

    setType: (value: "" | VoucherType) => void;

    setScope: (value: "" | VoucherScope) => void;

    setStatus: (value: "" | VoucherStatus) => void;

    setIsActive: (value: "" | "true" | "false") => void;
  };

  onReset: () => void;
};

const AdminVoucherFilter = ({ filters, actions, onReset }: Props) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="min-w-40 flex-1">
        <Input
          value={filters.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          placeholder="Tìm theo mã voucher..."
        />
      </div>

      {/* Type */}
      <div className="w-52">
        <Select
          value={filters.type || "ALL"}
          onValueChange={(value) =>
            actions.setType(value === "ALL" ? "" : (value as VoucherType))
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả loại</SelectItem>

            <SelectItem value={VOUCHER_TYPES.PERCENT}>Phần trăm</SelectItem>

            <SelectItem value={VOUCHER_TYPES.FIXED}>Giảm cố định</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scope */}
      <div className="w-52">
        <Select
          value={filters.scope || "ALL"}
          onValueChange={(value) =>
            actions.setScope(value === "ALL" ? "" : (value as VoucherScope))
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả phạm vi" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả phạm vi</SelectItem>

            <SelectItem value={VOUCHER_SCOPES.ORDER}>Toàn đơn hàng</SelectItem>

            <SelectItem value={VOUCHER_SCOPES.PRODUCT}>
              Theo sản phẩm
            </SelectItem>

            <SelectItem value={VOUCHER_SCOPES.CATEGORY}>
              Theo danh mục
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="w-52">
        <Select
          value={filters.status || "ALL"}
          onValueChange={(value) =>
            actions.setStatus(value === "ALL" ? "" : (value as VoucherStatus))
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

            <SelectItem value={VOUCHER_STATUSES.UPCOMING}>
              Sắp diễn ra
            </SelectItem>

            <SelectItem value={VOUCHER_STATUSES.ACTIVE}>
              Đang hoạt động
            </SelectItem>

            <SelectItem value={VOUCHER_STATUSES.EXPIRED}>Đã hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active */}
      <div className="w-52">
        <Select
          value={filters.isActive || "ALL"}
          onValueChange={(value) =>
            actions.setIsActive(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả hiển thị" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả hiển thị</SelectItem>

            <SelectItem value="true">Đang hoạt động</SelectItem>

            <SelectItem value="false">Tạm khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      <Button variant="warning" onClick={onReset} className="shrink-0 px-5">
        Reset
      </Button>
    </div>
  );
};

export default AdminVoucherFilter;
