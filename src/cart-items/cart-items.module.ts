import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { ProductVariantModule } from '@product-variant/product-variant.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartPricingModule } from 'src/cart-pricing/cart-pricing.module';

@Module({
  imports: [ProductVariantModule, PrismaModule, CartPricingModule],
  providers: [CartItemsService],
  controllers: [CartItemsController],
})
export class CartItemsModule {}
