import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Cho phép client join room theo userId
  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(`user:${userId}`);
  }

  // Hàm dùng để emit từ server
  sendToUser(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('notification', data);
  }
}
