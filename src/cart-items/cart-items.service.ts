import { Injectable } from '@nestjs/common';
import {
  CartItemResponseDto,
  CartResponseDto,
} from './dtos/cart-item-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductVariantService } from '@product-variant/product-variant.service';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private productVariantService: ProductVariantService,
  ) {}
}
