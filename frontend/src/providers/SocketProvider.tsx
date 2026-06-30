import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { addNotification } from "@features/notification/store/notification.slice";

type Props = {
  children: React.ReactNode;
};

export default function SocketProvider({ children }: Props) {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user?.id) return;

    const socket = connectSocket();

    socket.emit("join", user.id);

    socket.on("notification", (data) => {
      //console.log("socket data:", data);
      dispatch(
        addNotification({
          id: data.id,
          title: data.title,
          message: data.message,
          path: data.path,

          orderId: data.orderId,
          orderStatus: data.orderStatus,

          isRead: data.isRead,
          createdAt: data.createdAt,
        }),
      );
    });

    return () => {
      socket.off("notification");
      disconnectSocket();
    };
  }, [user?.id]);

  return <>{children}</>;
}
