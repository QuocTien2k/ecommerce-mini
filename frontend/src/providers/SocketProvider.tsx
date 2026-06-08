import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAppSelector } from "@app/hooks";

type Props = {
  children: React.ReactNode;
};

export default function SocketProvider({ children }: Props) {
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!user?.id) return;

    const socket = connectSocket();

    socket.emit("join", user.id);

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  return <>{children}</>;
}
