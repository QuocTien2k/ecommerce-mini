import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationResponseDto } from './dtos/notification.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    //console.log('[Socket] Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    //console.log('[Socket] Client disconnected:', client.id);
  }

  // Cho phép client join room theo userId
  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(`user:${userId}`);
    // console.log(
    //   `[Socket] User ${userId} joined room user:${userId} (socket: ${client.id})`,
    // );
  }

  // Hàm dùng để emit từ server
  sendToUser(userId: string, data: NotificationResponseDto) {
    this.server.to(`user:${userId}`).emit('notification', data);
  }
}
