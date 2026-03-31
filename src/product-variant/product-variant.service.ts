import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';

@Injectable()
export class ProductVariantService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private normalizeAttributes(
    attributes?: Record<string, string | number>,
  ): string | null {
    if (!attributes || Object.keys(attributes).length === 0) {
      return null;
    }

    const sortedKeys = Object.keys(attributes).sort();

    const normalizedObject = sortedKeys.reduce(
      (acc, key) => {
        acc[key] = attributes[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    return JSON.stringify(normalizedObject);
  }

  async create(dto: CreateProductVariantDto, files: Express.Multer.File[]) {
    //Check product
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (!product.isActive) {
      throw new BadRequestException('Sản phẩm đã bị vô hiệu hóa');
    }

    //Normalize attributes
    const normalizedAttributes = this.normalizeAttributes(dto.attributes);

    //Upload images
    if (!files || files.length === 0) {
      throw new BadRequestException('Phải upload ít nhất 1 ảnh');
    }

    const uploads = await this.cloudinaryService.uploadMultipleImages(
      files,
      'product-variants',
    );

    const images = uploads.map((item) => item.secure_url);
    const imagePublicIds = uploads.map((item) => item.public_id);

    try {
      //Create variant
      return await this.prisma.productVariant.create({
        data: {
          productId: dto.productId,
          color: dto.color,

          attributes: dto.attributes ?? null,
          attributesHash: normalizedAttributes,

          images,
          imagePublicIds,

          stock: dto.stock ?? 0,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Biến thể sản phẩm đã tồn tại');
      }
    }
  }
}
