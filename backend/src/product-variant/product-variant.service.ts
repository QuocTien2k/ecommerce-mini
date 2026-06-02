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
    const variants = await this.prisma.productVariant.findMany({
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

    return variants.map((variant) => ({
      ...variant,
      attributes:
        typeof variant.attributes === 'string'
          ? JSON.parse(variant.attributes)
          : variant.attributes,
    }));
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
      {} as Record<string, string | number>,
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
    const hasFiles = files && files.length > 0;
    const hasImageUrls = dto.imageUrls && dto.imageUrls.length > 0;

    if (!hasFiles && !hasImageUrls) {
      throw new BadRequestException('Phải upload ảnh hoặc cung cấp URL ảnh');
    }

    // Không cho phép dùng đồng thời
    if (hasFiles && hasImageUrls) {
      throw new BadRequestException(
        'Chỉ được upload ảnh hoặc cung cấp URL ảnh, không được dùng đồng thời',
      );
    }

    let images: string[] = [];
    let imagePublicIds: string[] = [];

    // Option 1: Upload Cloudinary
    if (hasFiles) {
      const uploads = await this.cloudinaryService.uploadMultipleImages(
        files,
        'product-variants',
      );

      images = uploads.map((item) => item.secure_url);
      imagePublicIds = uploads.map((item) => item.public_id);
    }

    // Option 2: Dùng URL ngoài
    if (hasImageUrls) {
      images = dto.imageUrls!;
      imagePublicIds = [];
    }

    const attributes =
      dto.attributes && Object.keys(dto.attributes).length > 0
        ? dto.attributes
        : Prisma.JsonNull;

    try {
      return await this.prisma.productVariant.create({
        data: {
          productId: dto.productId,
          color: dto.color,

          attributes,
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

      throw error;
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

    const isCloudinaryVariant = variant.imagePublicIds.length > 0;
    const isExternalVariant = variant.imagePublicIds.length === 0;

    // Không cho phép trộn 2 nguồn ảnh
    if (files?.length && dto.imageUrls?.length) {
      throw new BadRequestException(
        'Chỉ được upload ảnh hoặc cung cấp URL ảnh, không được dùng đồng thời',
      );
    }

    let images = [...variant.images];
    let imagePublicIds = [...variant.imagePublicIds];

    let uploadedPublicIds: string[] = [];

    // cloudinary
    if (isCloudinaryVariant) {
      if (dto.imageUrls?.length) {
        throw new BadRequestException(
          'Biến thể này đang sử dụng ảnh Cloudinary',
        );
      }

      // Xóa ảnh cloudinary
      if (dto.removeImagePublicIds?.length) {
        const validPublicIds = dto.removeImagePublicIds.filter((id) =>
          imagePublicIds.some((pubId) => pubId.endsWith(id)),
        );

        const fullPublicIdsToRemove = validPublicIds.map(
          (id) => imagePublicIds.find((pubId) => pubId.endsWith(id))!,
        );

        await Promise.all(
          fullPublicIdsToRemove.map((publicId) =>
            this.cloudinaryService.deleteImage(publicId),
          ),
        );

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

      // Upload ảnh mới
      if (files?.length) {
        const uploads = await this.cloudinaryService.uploadMultipleImages(
          files,
          'product-variants',
        );

        images.push(...uploads.map((i) => i.secure_url));
        imagePublicIds.push(...uploads.map((i) => i.public_id));

        uploadedPublicIds = uploads.map((i) => i.public_id);
      }
    }

    // Link ảnh
    if (isExternalVariant) {
      if (dto.removeImagePublicIds?.length) {
        throw new BadRequestException('Biến thể này không sử dụng Cloudinary');
      }

      if (files?.length) {
        throw new BadRequestException(
          'Biến thể này đang sử dụng URL ảnh ngoài',
        );
      }

      // Thay toàn bộ danh sách ảnh
      if (dto.imageUrls !== undefined) {
        images = dto.imageUrls;
      }
    }

    // Validate phải còn ít nhất 1 ảnh
    if (images.length === 0) {
      throw new BadRequestException('Biến thể phải có ít nhất 1 ảnh');
    }

    // Recompute attributesHash nếu attributes thay đổi
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
      // rollback cloudinary uploads nếu DB fail
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
