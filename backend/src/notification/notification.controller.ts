import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import {
  NotificationIdDto,
  NotificationQueryDto,
} from './dtos/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Lấy danh sách thông báo thành công!')
  getMyNotifications(
    @CurrentUser('sub') userId: string,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationService.getMyNotifications(userId, query);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Đọc 1 thông báo thành công!')
  markAsRead(
    @Param() { id }: NotificationIdDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.notificationService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Đọc hết tin thành công!')
  markAll(@CurrentUser('sub') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
}
