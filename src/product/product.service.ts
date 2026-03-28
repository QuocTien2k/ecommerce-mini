import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { toSlug } from '@common/utils/slug';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  calcDiscountPrice(price: number, pct?: number): number | null {
    if (!pct) return null;

    return Math.floor(price * (1 - pct / 100));
  }

  async create(dto: CreateProductDto, userId: string) {
    //check category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category không tồn tại!');
    }

    //discount input
    const discountPrice = this.calcDiscountPrice(dto.price, dto.discountPct);

    //logic giá
    if (discountPrice != null && discountPrice >= dto.price) {
      throw new BadRequestException('Giá giảm không hợp lệ');
    }

    //Slug
    const baseSlug = toSlug(dto.slug || dto.name);
    let attempt = 0;

    while (attempt < 5) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

      try {
        return await this.prisma.product.create({
          data: {
            name: dto.name,
            slug,
            description: dto.description,

            price: dto.price.toString(),
            discountPrice: discountPrice?.toString(),
            discountPct: dto.discountPct ?? null,

            isActive: dto.isActive ?? true,

            categoryId: dto.categoryId,
            creatorId: userId,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];

          if (target?.includes('slug')) {
            attempt++;
            continue;
          }
        }

        throw error;
      }
    }

    throw new ConflictException('Không thể tạo slug duy nhất');
  }
}
