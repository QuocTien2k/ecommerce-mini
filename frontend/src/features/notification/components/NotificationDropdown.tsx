import { motion, AnimatePresence } from "framer-motion";
import { NotificationContent } from "./NotificationContent";
import { useNotifications } from "../hooks/useNotificationCenter";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const NotificationDropdown = ({ open, onClose }: Props) => {
  const {
    loading,
    merged,
    unreadCount,
    isPending,
    handleNotificationClick,
    handleMarkAllRead,
  } = useNotifications();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-0 z-50 mt-2 w-[calc(100vw-16px)] max-w-96 rounded-lg border bg-white shadow-xl"
        >
          <NotificationContent
            loading={loading}
            merged={merged}
            unreadCount={unreadCount}
            isPending={isPending}
            onMarkAllRead={handleMarkAllRead}
            onNotificationClick={(notification) =>
              handleNotificationClick(notification, onClose)
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
