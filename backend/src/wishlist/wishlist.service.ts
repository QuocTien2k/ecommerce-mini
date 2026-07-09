import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { GetWishlistQueryDto } from './dtos/get-wishlist.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  /* Case get */
  async getWishlist(userId: string, query: GetWishlistQueryDto) {
    const { page, limit, skip } = getPagination({
      ...query,
      limit: query.limit ?? 10,
    });

    const [data, total] = await Promise.all([
      this.prisma.wishlist.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,

              price: true,
              discountPrice: true,
              discountPct: true,

              ratingAvg: true,
              ratingCount: true,

              isActive: true,
              deletedAt: true,
            },
          },
        },
      }),

      this.prisma.wishlist.count({
        where: {
          userId,
        },
      }),
    ]);

    const mappedData = data.map((item) => ({
      ...item.product,
      price: item.product.price.toString(),
      discountPrice: item.product.discountPrice?.toString() ?? null,
      isWishlisted: true,
      wishedAt: item.createdAt,
    }));

    return buildPaginatedResponse(mappedData, total, page, limit);
  }

  /* Case toggle wishlist */
  async toggleWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const existed = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existed) {
      await this.prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return {
        isWishlisted: false,
      };
    }

    await this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return {
      isWishlisted: true,
    };
  }
}
