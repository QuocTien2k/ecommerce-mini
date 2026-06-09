import { useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen((v) => !v)}>
        <NotificationBell />
      </div>

      <NotificationDropdown open={open} />
    </div>
  );
};
