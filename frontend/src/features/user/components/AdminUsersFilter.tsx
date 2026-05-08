import type { Role } from "@/types/role";

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
    <>
      <div className="grid grid-cols-4 gap-4">
        <input
          value={filters.keyword}
          onChange={(e) => actions.setKeyword(e.target.value)}
          placeholder="Tìm email hoặc số điện thoại..."
          className="border rounded-md px-3 py-2"
        />

        <input
          value={filters.id}
          onChange={(e) => actions.setId(e.target.value)}
          placeholder="Tìm theo ID..."
          className="border rounded-md px-3 py-2"
        />

        <select
          value={filters.role}
          onChange={(e) => actions.setRole(e.target.value as Role | "")}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Tất cả role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>

        <select
          value={filters.isActive}
          onChange={(e) =>
            actions.setIsActive(e.target.value as "" | "true" | "false")
          }
          className="border rounded-md px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Active</option>
          <option value="false">Locked</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button onClick={onReset} className="border px-4 py-2 rounded-md">
          Reset bộ lọc
        </button>
      </div>
    </>
  );
};

export default AdminUsersFilter;
