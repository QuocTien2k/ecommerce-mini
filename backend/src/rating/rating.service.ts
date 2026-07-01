import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '@order/order.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { RatingDto } from './dtos/rating.dto';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  private async ensureUserCanRate(userId: string, productId: string) {
    const canRate = await this.orderService.canUserRateProduct(
      userId,
      productId,
    );

    if (!canRate) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đánh giá các sản phẩm mà bạn đã mua!',
      );
    }
  }

  private async ensureProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
  }

  /*Case delete*/
  private async updateProductStatsOnDelete(
    tx: Prisma.TransactionClient,
    productId: string,
    oldValue: number,
  ) {
    const stats = await tx.product.findUnique({
      where: { id: productId },
      select: {
        ratingSum: true,
        ratingCount: true,
      },
    });

    const newSum = (stats?.ratingSum || 0) - oldValue;
    const newCount = Math.max((stats?.ratingCount || 0) - 1, 0);

    const newAvg = newCount > 0 ? Number((newSum / newCount).toFixed(1)) : 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        ratingSum: newSum,
        ratingCount: newCount,
        ratingAvg: newAvg,
      },
    });
  }

  async delete(userId: string, productId: string) {
    await this.ensureProductExists(productId);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.rating.findUnique({
        where: {
          productId_userId: { productId, userId },
        },
      });

      if (!existing) {
        throw new NotFoundException('Bạn chưa đánh giá sản phẩm này');
      }

      await tx.rating.delete({
        where: {
          productId_userId: { productId, userId },
        },
      });

      await this.updateProductStatsOnDelete(tx, productId, existing.value);
    });
  }

  /*Case get*/
  async getMyRating(userId: string, productId: string) {
    return this.prisma.rating.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });
  }

  /* Case upset */
  private async incrementProductStats(
    tx: Prisma.TransactionClient,
    productId: string,
    value: number,
  ) {
    const stats = await tx.product.findUnique({
      where: { id: productId },
      select: {
        ratingSum: true,
        ratingCount: true,
      },
    });

    const newSum = (stats?.ratingSum || 0) + value;
    const newCount = (stats?.ratingCount || 0) + 1;
    const newAvg = Number((newSum / newCount).toFixed(1));

    await tx.product.update({
      where: { id: productId },
      data: {
        ratingSum: newSum,
        ratingCount: newCount,
        ratingAvg: newAvg,
      },
    });
  }

  private async adjustProductStats(
    tx: Prisma.TransactionClient,
    productId: string,
    oldValue: number,
    newValue: number,
  ) {
    const diff = newValue - oldValue;

    const stats = await tx.product.findUnique({
      where: { id: productId },
      select: {
        ratingSum: true,
        ratingCount: true,
      },
    });

    const newSum = (stats?.ratingSum || 0) + diff;
    const count = stats?.ratingCount || 0;

    const newAvg = count > 0 ? Number((newSum / count).toFixed(1)) : 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        ratingSum: newSum,
        ratingAvg: newAvg,
      },
    });
  }

  async upsert(userId: string, dto: RatingDto) {
    const { productId, value } = dto;

    await this.ensureProductExists(productId);
    await this.ensureUserCanRate(userId, productId);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.rating.findUnique({
        where: {
          productId_userId: { productId, userId },
        },
      });

      // CASE 1: CREATE
      if (!existing) {
        const rating = await tx.rating.create({
          data: {
            userId,
            productId,
            value,
          },
        });

        await this.incrementProductStats(tx, productId, value);

        return rating;
      }

      // CASE 2: UPDATE
      const rating = await tx.rating.update({
        where: {
          productId_userId: { productId, userId },
        },
        data: { value },
      });

      await this.adjustProductStats(tx, productId, existing.value, value);

      return rating;
    });
  }
}
