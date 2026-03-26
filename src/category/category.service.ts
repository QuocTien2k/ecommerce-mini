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

  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    const slug = toSlug(dto.slug || dto.name);

    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('Slug đã tồn tại!');
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Không tìm thấy danh mục cha');
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
        slug,
        description: dto.description,
        image: imageUrl,
        imagePublicId: publicId,
        parentId: dto.parentId ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }
}
