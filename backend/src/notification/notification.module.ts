import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { PrismaModule } from '@prisma/prisma.module';
import { NotificationsController } from './notification.controller';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationService],
  exports: [NotificationsGateway, NotificationService],
})
export class NotificationModule {}
