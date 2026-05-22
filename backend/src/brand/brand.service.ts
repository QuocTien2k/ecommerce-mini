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

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const baseSlug = toSlug(dto.slug || dto.name);
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
}
