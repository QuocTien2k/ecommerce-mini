import type { Role } from "@/types/role";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

type Props = {
  filters: {
    keyword: string;
    id: string;
    role: Role | "";
    isActive: "" | "true" | "false";
  };

  actions: {
    setKeyword: (value: string) => void;
    setId: (value: string) => void;
    setRole: (value: Role | "") => void;
    setIsActive: (value: "" | "true" | "false") => void;
  };

  onReset: () => void;
};

const AdminUsersFilter = ({ filters, actions, onReset }: Props) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-40 flex-1">
        <Input
          value={filters.keyword}
          onChange={(e) => actions.setKeyword(e.target.value)}
          placeholder="Email hoặc số điện thoại..."
        />
      </div>

      <div className="w-80">
        <Input
          value={filters.id}
          onChange={(e) => actions.setId(e.target.value)}
          placeholder="Tìm theo ID..."
        />
      </div>

      <div className="w-60">
        <Select
          value={filters.role || "ALL"}
          onValueChange={(value) =>
            actions.setRole(value === "ALL" ? "" : (value as Role))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Tất cả role</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-60">
        <Select
          value={filters.isActive || "ALL"}
          onValueChange={(value) =>
            actions.setIsActive(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="warning" onClick={onReset} className="shrink-0 px-5">
        Reset
      </Button>
    </div>
  );
};

export default AdminUsersFilter;
