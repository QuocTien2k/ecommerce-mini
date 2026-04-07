import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
