import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VNPayProvider } from './vnpay.provider';

@Module({
  imports: [PrismaModule],
  providers: [PaymentService, VNPayProvider],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
