import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CartPricingModule } from './cart-pricing/cart-pricing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env dùng global
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    CartItemsModule,
    CartPricingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
