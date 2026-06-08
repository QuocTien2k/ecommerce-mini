import { Checkbox } from "@/components/ui/checkbox";
import { AssignVoucherUserItem } from "./AssignVoucherUserItem";
import type { AdminUser } from "@features/admin/user/types/adminUser.type";
import { useMemo } from "react";

type Props = {
  users: AdminUser[];

  selectedUserIds: string[];

  onToggleUser: (userId: string) => void;

  onSelectAll: () => void;
  onUnselectAll: () => void;
};

export const AssignVoucherUserList = ({
  users,
  selectedUserIds,
  onToggleUser,
  onSelectAll,
  onUnselectAll,
}: Props) => {
  //   console.log("render list");
  //   console.log("selectedUserIds", selectedUserIds);

  const allSelected = useMemo(() => {
    if (!users.length) return false;
    const set = new Set(selectedUserIds);
    return users.every((u) => set.has(u.id));
  }, [users, selectedUserIds]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => {
            if (checked) onSelectAll();
            else onUnselectAll();
          }}
        />

        <span className="text-sm">Chọn tất cả ({users.length})</span>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <AssignVoucherUserItem
            key={user.id}
            user={user}
            checked={selectedUserIds.includes(user.id)}
            onToggle={onToggleUser}
          />
        ))}
      </div>
    </div>
  );
};
