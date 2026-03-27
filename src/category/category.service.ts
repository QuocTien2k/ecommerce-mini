import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { toSlug } from '@common/utils/slug';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  //check level category
  async getCategoryLevel(categoryId: string): Promise<number> {
    let level = 1;
    let current = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    while (current?.parentId) {
      level++;
      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: { parentId: true },
      });
    }

    return level;
  }

  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    let slug = toSlug(dto.slug || dto.name);
    let uniqueSlug = slug;
    let counter = 1;

    while (
      await this.prisma.category.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Không tìm thấy danh mục cha');
      }

      const parentLevel = await this.getCategoryLevel(dto.parentId);
      if (parentLevel >= 3) {
        throw new BadRequestException('Category con vượt quá level 3');
      }
    }

    let imageUrl: string | null = null;
    let publicId: string | null = null;

    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('File phải là hình ảnh');
      }

      const result = await this.cloudinaryService.uploadImage(
        file,
        'categories/images', // folder cho category
      );

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: uniqueSlug,
        description: dto.description,
        image: imageUrl,
        imagePublicId: publicId,
        parentId: dto.parentId ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }
}
