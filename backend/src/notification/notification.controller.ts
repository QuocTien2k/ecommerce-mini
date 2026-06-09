import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Lấy danh sách thông báo thành công!')
  getMyNotifications(@Req() req) {
    return this.notificationService.getMyNotifications(req.user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Đọc 1 thông báo thành công!')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Đọc hết tin thành công!')
  markAll(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
