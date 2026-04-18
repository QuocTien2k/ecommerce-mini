import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '@order/order.service';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRatingDto } from '@rating/dtos/create-rating.dto';
import { UpdateRatingDto } from '@rating/dtos/update-rating.sto';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async create(userId: string, dto: CreateRatingDto) {
    const { productId, value } = dto;

    //check rating (đã mua & delivered)
    const canRate = await this.orderService.canUserRateProduct(
      userId,
      productId,
    );

    if (!canRate) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đánh giá các sản phẩm mà bạn đã mua!',
      );
    }

    //check rating
    const existing = await this.prisma.rating.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi!');
    }

    //create rating + update product stats
    return this.prisma.$transaction(async (tx) => {
      const rating = await tx.rating.create({
        data: {
          productId,
          userId,
          value,
        },
      });

      const stats = await tx.rating.aggregate({
        where: { productId },
        _avg: { value: true },
        _count: { value: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg: stats._avg.value || 0,
          ratingCount: stats._count.value,
        },
      });

      return rating;
    });
  }

  async update(userId: string, productId: string, dto: UpdateRatingDto) {
    const existing = await this.prisma.rating.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Bạn chưa đánh giá sản phẩm này');
    }

    return this.prisma.$transaction(async (tx) => {
      const rating = await tx.rating.update({
        where: {
          productId_userId: {
            productId,
            userId,
          },
        },
        data: {
          value: dto.value,
        },
      });

      const stats = await tx.rating.aggregate({
        where: { productId },
        _avg: { value: true },
        _count: { value: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg: stats._avg.value || 0,
          ratingCount: stats._count.value,
        },
      });

      return rating;
    });
  }
}
