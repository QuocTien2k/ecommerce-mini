import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { UpdateProductVariantDto } from './dtos/update-product-variant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductVariantService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findById(variantId: string, options?: { includeProduct?: boolean }) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: options?.includeProduct ?? false,
      },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        color: true,
        attributes: true,
        attributesHash: true,
        images: true,
        imagePublicIds: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

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

  async update(
    id: string,
    dto: UpdateProductVariantDto,
    files?: Express.Multer.File[],
  ) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Biến thể không tồn tại');
    }

    let images = [...variant.images];
    let imagePublicIds = [...variant.imagePublicIds];

    //Xóa ảnh theo publicId
    if (dto.removeImagePublicIds?.length) {
      const validPublicIds = dto.removeImagePublicIds.filter((id) =>
        imagePublicIds.some((pubId) => pubId.endsWith(id)),
      );

      const fullPublicIdsToRemove = validPublicIds.map(
        (id) => imagePublicIds.find((pubId) => pubId.endsWith(id))!,
      );

      //delete cloud
      await Promise.all(
        fullPublicIdsToRemove.map((publicId) =>
          this.cloudinaryService.deleteImage(publicId),
        ),
      );

      // filter theo index
      const newImages: string[] = [];
      const newPublicIds: string[] = [];

      for (let i = 0; i < imagePublicIds.length; i++) {
        if (!fullPublicIdsToRemove.includes(imagePublicIds[i])) {
          newImages.push(images[i]);
          newPublicIds.push(imagePublicIds[i]);
        }
      }

      images = newImages;
      imagePublicIds = newPublicIds;
    }

    //Upload ảnh mới
    let uploadedPublicIds: string[] = [];

    if (files && files.length > 0) {
      files.forEach((file) => {
        if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException('File phải là hình ảnh');
        }
      });

      const uploads = await this.cloudinaryService.uploadMultipleImages(
        files,
        'product-variants',
      );

      images.push(...uploads.map((i) => i.secure_url));
      imagePublicIds.push(...uploads.map((i) => i.public_id));
      uploadedPublicIds = uploads.map((i) => i.public_id);
    }

    //Validate ảnh
    if (images.length === 0) {
      throw new BadRequestException('Biến thể phải có ít nhất 1 ảnh');
    }

    //Recompute attributesHash nếu attributes thay đổi
    let attributes:
      | Prisma.InputJsonValue
      | Prisma.NullableJsonNullValueInput
      | undefined = variant.attributes as Prisma.InputJsonValue;
    let attributesHash = variant.attributesHash;

    if (dto.attributes !== undefined) {
      const isEmpty = Object.keys(dto.attributes).length === 0;

      attributes = isEmpty
        ? Prisma.JsonNull
        : (dto.attributes as Prisma.InputJsonValue);

      attributesHash = isEmpty
        ? null
        : this.normalizeAttributes(dto.attributes);
    }

    try {
      return await this.prisma.productVariant.update({
        where: { id },
        data: {
          color: dto.color ?? variant.color,
          attributes,
          attributesHash,

          stock: dto.stock ?? variant.stock,

          images,
          imagePublicIds,
        },
      });
    } catch (error) {
      // rollback uploaded images nếu DB fail
      if (uploadedPublicIds.length) {
        await Promise.all(
          uploadedPublicIds.map((id) => this.cloudinaryService.deleteImage(id)),
        );
      }

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Biến thể với màu sắc và thuộc tính này đã tồn tại',
        );
      }
      throw error;
    }
  }
}
