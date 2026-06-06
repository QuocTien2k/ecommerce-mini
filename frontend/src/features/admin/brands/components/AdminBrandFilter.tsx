import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  filters: {
    name: string;
    isActive: "" | "true" | "false";
    fromDate: string;
    toDate: string;
  };

  actions: {
    setName: (value: string) => void;
    setIsActive: (value: "" | "true" | "false") => void;
    setFromDate: (value: string) => void;
    setToDate: (value: string) => void;
  };

  onReset: () => void;
};

const AdminBrandFilter = ({ filters, actions, onReset }: Props) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="min-w-40 flex-1">
        <Input
          value={filters.name}
          onChange={(e) => actions.setName(e.target.value)}
          placeholder="Tìm theo tên thương hiệu..."
        />
      </div>

      {/* Status */}
      <div className="w-60">
        <Select
          value={filters.isActive || "ALL"}
          onValueChange={(value) =>
            actions.setIsActive(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

            <SelectItem value="true">Hoạt động</SelectItem>

            <SelectItem value="false">Tạm khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* From Date */}
      <div className="w-52">
        <Input
          className="cursor-pointer"
          type="date"
          value={filters.fromDate}
          onChange={(e) => actions.setFromDate(e.target.value)}
        />
      </div>

      {/* To Date */}
      <div className="w-52">
        <Input
          className="cursor-pointer"
          type="date"
          value={filters.toDate}
          onChange={(e) => actions.setToDate(e.target.value)}
        />
      </div>

      {/* Reset */}
      <Button variant="warning" onClick={onReset} className="shrink-0 px-5">
        Reset
      </Button>
    </div>
  );
};

export default AdminBrandFilter;
