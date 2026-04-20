import { Module } from '@nestjs/common';
import { CartPricingService } from './cart-pricing.service';
import { CartPricingController } from './cart-pricing.controller';

@Module({
  providers: [CartPricingService],
  controllers: [CartPricingController],
  exports: [CartPricingService],
})
export class CartPricingModule {}
