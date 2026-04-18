import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { OrderModule } from '@order/order.module';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  imports: [PrismaModule, OrderModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
