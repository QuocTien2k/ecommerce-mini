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

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

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

    //create rating + update product stats
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.rating.findUnique({
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

      let rating;

      try {
        rating = await tx.rating.create({
          data: {
            productId,
            userId,
            value,
          },
        });
      } catch (err: any) {
        // Prisma unique constraint
        if (err.code === 'P2002') {
          throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi!');
        }
        throw err;
      }

      const stats = await tx.rating.aggregate({
        where: { productId },
        _avg: { value: true },
        _count: { value: true },
      });

      const ratingAvg =
        stats._avg.value !== null ? Number(stats._avg.value.toFixed(1)) : 0; // làm tròn 1 chữ số thập phân

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg,
          ratingCount: stats._count.value,
        },
      });

      return rating;
    });
  }

  async update(userId: string, productId: string, dto: UpdateRatingDto) {
    const { value } = dto;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

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
      // update rating
      const rating = await tx.rating.updateMany({
        where: {
          productId,
          userId,
        },
        data: {
          value,
        },
      });

      if (rating.count === 0) {
        throw new NotFoundException('Bạn chưa đánh giá sản phẩm này');
      }
      //recompute stats (safe)
      const stats = await tx.rating.aggregate({
        where: { productId },
        _avg: { value: true },
        _count: { value: true },
      });

      const ratingAvg =
        stats._avg.value !== null ? Number(stats._avg.value.toFixed(1)) : 0; // làm trò

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg,
          ratingCount: stats._count.value,
        },
      });

      return rating;
    });
  }
}
