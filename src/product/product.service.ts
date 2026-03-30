import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { toSlug } from '@common/utils/slug';
import { UpdateProductDto } from './dtos/update-product.dto';

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

  async update(id: string, dto: UpdateProductDto) {
    //Check
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    //Validate category
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Danh mục không tồn tại!');
      }
    }

    //undefinded => giữ disocunt, null=> xóa, number => cập nhật
    const price = dto.price ?? Number(existing.price);

    let pct: number | null;

    if (dto.discountPct === null) {
      pct = null;
    } else if (dto.discountPct !== undefined) {
      pct = dto.discountPct;
    } else {
      pct = existing.discountPct;
    }

    //Calc discountPrice
    const discountPrice =
      pct !== null && pct !== undefined
        ? this.calcDiscountPrice(price, pct)
        : null;

    //logic giá
    if (discountPrice != null && discountPrice >= price) {
      throw new BadRequestException('Giá giảm không hợp lệ');
    }

    const data: any = {
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,

      price: price.toString(),
      discountPrice: discountPrice?.toString() ?? null,
      discountPct: pct,

      isActive: dto.isActive ?? existing.isActive,

      categoryId: dto.categoryId ?? existing.categoryId,
    };

    //Handle slug
    if (dto.slug) {
      const baseSlug = toSlug(dto.slug);

      // nếu slug không đổi → skip
      if (baseSlug === existing.slug) {
        data.slug = existing.slug;
      } else {
        let attempt = 0;

        while (attempt < 5) {
          const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

          try {
            return await this.prisma.product.update({
              where: { id },
              data: {
                ...data,
                slug,
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

    //Không update slug
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
