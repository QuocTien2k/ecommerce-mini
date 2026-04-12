import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '@user/user.module';
import { NotificationModule } from '@notification/notification.module';
import { VoucherModule } from '@voucher/voucher.module';

@Module({
  imports: [PrismaModule, UserModule, NotificationModule, VoucherModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
