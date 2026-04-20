import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '@order/order.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRatingDto } from '@rating/dtos/create-rating.dto';
import { UpdateRatingDto } from '@rating/dtos/update-rating.sto';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  /*Case create*/
  private async ensureNotRated(
    tx: Prisma.TransactionClient,
    userId: string,
    productId: string,
  ) {
    const existing = await tx.rating.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });

    if (existing) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi!');
    }
  }

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

  private async createRating(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateRatingDto,
  ) {
    try {
      return await tx.rating.create({
        data: {
          userId,
          productId: dto.productId,
          value: dto.value,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi!');
      }
      throw err;
    }
  }

  private async updateProductStatsOnCreate(
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

  async create(userId: string, dto: CreateRatingDto) {
    await this.ensureProductExists(dto.productId);
    await this.ensureUserCanRate(userId, dto.productId);

    return this.prisma.$transaction(async (tx) => {
      await this.ensureNotRated(tx, userId, dto.productId);

      const rating = await this.createRating(tx, userId, dto);

      await this.updateProductStatsOnCreate(tx, dto.productId, dto.value);

      return rating;
    });
  }

  /*Case update*/
  private async getExistingRating(userId: string, productId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });

    if (!rating) {
      throw new NotFoundException('Bạn chưa đánh giá sản phẩm này');
    }

    return rating;
  }

  private async updateRating(
    tx: Prisma.TransactionClient,
    userId: string,
    productId: string,
    value: number,
  ) {
    return tx.rating.update({
      where: {
        productId_userId: { productId, userId },
      },
      data: { value },
    });
  }

  private async updateProductStatsOnUpdate(
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

  async update(userId: string, productId: string, dto: UpdateRatingDto) {
    const { value } = dto;

    await this.ensureProductExists(productId);

    const existing = await this.getExistingRating(userId, productId);

    return this.prisma.$transaction(async (tx) => {
      const rating = await this.updateRating(tx, userId, productId, value);

      await this.updateProductStatsOnUpdate(
        tx,
        productId,
        existing.value,
        value,
      );

      return rating;
    });
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

    const existing = await this.getExistingRating(userId, productId);

    return this.prisma.$transaction(async (tx) => {
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
}
