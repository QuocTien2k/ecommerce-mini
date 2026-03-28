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

  async create(dto: CreateProductDto, userId: string) {
    const baseSlug = toSlug(dto.slug || dto.name);
    let attempt = 0;

    while (attempt < 5) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

      try {
        const category = await this.prisma.category.findUnique({
          where: { id: dto.categoryId },
        });

        if (!category) {
          throw new BadRequestException('Category không tồn tại!');
        }

        if (dto.discountPrice && dto.discountPrice >= dto.price) {
          throw new BadRequestException('Giá giảm phải nhỏ hơn giá thật');
        }

        if (dto.discountPct && (dto.discountPct < 0 || dto.discountPct > 100)) {
          throw new BadRequestException('Giá giảm % không hợp lệ');
        }

        return await this.prisma.product.create({
          data: {
            name: dto.name,
            slug,
            description: dto.description,

            price: dto.price.toString(),
            discountPrice: dto.discountPrice?.toString(),
            discountPct: dto.discountPct,

            isActive: dto.isActive ?? true,

            categoryId: dto.categoryId,
            creatorId: userId,
          },
        });
      } catch (error) {
        // unique slug
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
