import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { toSlug } from '@common/utils/slug';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import {
  GetBrandDto,
  GetBrandQueryBase,
  GetPublicBrandDto,
} from './dtos/get-brand.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const baseSlug = toSlug(dto.name);
    let attempt = 0;

    while (attempt < 5) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

      try {
        return await this.prisma.brand.create({
          data: {
            name: dto.name,
            slug,
            isActive: dto.isActive ?? true,
          },
        });
      } catch (error: any) {
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

    throw new ConflictException('Không thể tạo slug duy nhất cho brand');
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand không tồn tại');
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        isActive: dto.isActive,
      },
    });
  }

  async softDelete(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand không tồn tại');
    }

    if (brand.deletedAt) {
      throw new BadRequestException('Brand đã bị xoá trước đó');
    }

    const productCount = await this.prisma.product.count({
      where: {
        brandId: id,
        isActive: true,
      },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        'Không thể xoá thương hiệu đang có sản phẩm',
      );
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async restore(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand không tồn tại');
    }

    if (!brand.deletedAt) {
      throw new BadRequestException('Brand chưa bị xoá');
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
    });
  }

  private buildBrandWhere(query: GetBrandQueryBase) {
    const where: Prisma.BrandWhereInput = {};

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = {
        ...(query.fromDate && { gte: new Date(query.fromDate) }),
        ...(query.toDate && { lte: new Date(query.toDate) }),
      };
    }

    return where;
  }

  //list for admin
  async findAll(query: GetBrandDto) {
    const { page, limit, skip } = getPagination(query);

    const where = this.buildBrandWhere(query);

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [brands, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.brand.count({
        where,
      }),
    ]);

    return buildPaginatedResponse(brands, total, page, limit);
  }

  //list public
  async findAllPublic(query: GetPublicBrandDto) {
    const { page, limit, skip } = getPagination(query);

    const where = {
      ...this.buildBrandWhere(query),
      isActive: true,
    };

    const [brands, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return buildPaginatedResponse(brands, total, page, limit);
  }
}
