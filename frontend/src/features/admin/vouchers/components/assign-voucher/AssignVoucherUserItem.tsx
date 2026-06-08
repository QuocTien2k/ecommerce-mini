import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AdminUser } from "@features/admin/user/types/adminUser.type";

type Props = {
  user: AdminUser;
  checked: boolean;
  onToggle: (userId: string) => void;
};

export const AssignVoucherUserItem = ({ user, checked, onToggle }: Props) => {
  return (
    <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle(user.id)}
        onClick={(e) => e.stopPropagation()}
      />

      <Avatar>
        <AvatarImage src={user.avatar ?? undefined} />
        <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.fullname}</p>

        <p className="text-muted-foreground truncate text-sm">{user.email}</p>
      </div>
    </div>
  );
};
