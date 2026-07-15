import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { ProductVariantModule } from '@product-variant/product-variant.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartPricingModule } from 'src/cart-pricing/cart-pricing.module';
import { VoucherModule } from '@voucher/voucher.module';

@Module({
  imports: [
    ProductVariantModule,
    PrismaModule,
    CartPricingModule,
    VoucherModule,
  ],
  providers: [CartItemsService],
  exports: [CartItemsService],
  controllers: [CartItemsController],
})
export class CartItemsModule {}
