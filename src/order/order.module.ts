import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '@user/user.module';
import { NotificationModule } from '@notification/notification.module';
import { VoucherModule } from '@voucher/voucher.module';
import { PaymentModule } from '@payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    NotificationModule,
    VoucherModule,
    PaymentModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
