import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationModule } from '@notification/notification.module';
import { CategoryModule } from '@category/category.module';

@Module({
  imports: [PrismaModule, NotificationModule, CategoryModule],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
