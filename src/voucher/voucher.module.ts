import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationModule } from '@notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
